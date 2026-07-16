import cv2
import numpy as np
from typing import Dict, List, Optional, Tuple


def read_single_column(
    col_binary: np.ndarray,
    rows: int,
    cell_height: float,
    min_density: float
) -> Tuple[int, List[int]]:
    """
    Evaluates bubble density for all rows in a single column using relative thresholds.
    """
    col_height = col_binary.shape[0]
    densities: List[float] = []

    for row in range(rows):
        y1 = int(row * cell_height)
        y2 = int((row + 1) * cell_height)
        if row == rows - 1:
            y2 = col_height

        cell = col_binary[y1:y2, :]
        total_pixels = cell.shape[0] * cell.shape[1]
        
        density = cv2.countNonZero(cell) / float(total_pixels) if total_pixels > 0 else 0
        densities.append(density)

    mean_density = np.mean(densities)
    filled_rows: List[int] = []
    
    for r, d in enumerate(densities):
        if d > 0.20 and d > mean_density * 1.35:
            filled_rows.append(r)

    if len(filled_rows) == 1:
        return filled_rows[0], filled_rows
    
    return -1, filled_rows


def extract_numerical_answer(
    block_img: np.ndarray,
    rows: int = 10,
    cols: int = 7,
    crop_top: int = 26,
    crop_bottom: int = 5,
    crop_left: int = 25,
    crop_right: int = 5,
    min_density: float = 0.20,
    adaptive_block_size: int = 21,
    adaptive_c: int = 10
) -> str:
    """
    Parses a cropped numerical OMR answer block to extract its 7-digit value.

    Args:
        block_img: BGR image crop of the numerical question block.
        rows: Number of digit rows (0-9, standard is 10).
        cols: Number of digits in the answer grid (standard is 7).
        crop_top: Pixels to crop from the top (removes block titles).
        crop_bottom: Pixels to crop from the bottom border.
        crop_left: Pixels to crop from the left border (removes question numbers).
        crop_right: Pixels to crop from the right border.
        min_density: (Legacy) Minimum ratio of white pixels. Covered dynamically by dynamic relative ratio helper.
        adaptive_block_size: Size of pixel neighborhood for local thresholding.
        adaptive_c: Constant subtracted from the mean for local thresholding.

    Returns:
        A 7-character string containing digits (0-9) and "_" representing empty/multi-filled slots.
    """
    if block_img is None or block_img.size == 0:
        raise ValueError("Provided crop image is empty or invalid.")

    # Convert to grayscale
    if len(block_img.shape) == 3:
        gray = cv2.cvtColor(block_img, cv2.COLOR_BGR2GRAY)
    else:
        gray = block_img.copy()

    # Preprocess with a subtle blur to smooth contour edges
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)

    # Convert to inverse binary mask
    binary = cv2.adaptiveThreshold(
        blurred,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        adaptive_block_size,
        adaptive_c
    )

    # Crop margins to isolate the bubbling grid
    h, w = binary.shape
    t_crop = max(0, min(crop_top, h - 1))
    b_crop = max(0, min(h - crop_bottom, h))
    l_crop = max(0, min(crop_left, w - 1))
    r_crop = max(0, min(w - crop_right, w))

    grid_binary = binary[t_crop:b_crop, l_crop:r_crop]
    grid_h, grid_w = grid_binary.shape

    if grid_h == 0 or grid_w == 0:
        return "_" * cols

    # Alignment settings matching teammate A's coordinate margins
    left_margin = 0
    right_margin = 1
    top_margin = 5
    bottom_margin = 3

    usable_w = grid_w - left_margin - right_margin
    usable_h = grid_h - top_margin - bottom_margin

    # Calculate precise cell sizes using floats to prevent rounding drift
    cell_width = usable_w / cols
    cell_height = usable_h / rows

    answer_digits: List[str] = []

    for col in range(cols):
        x1 = int(left_margin + col * cell_width)
        x2 = int(left_margin + (col + 1) * cell_width)
        if col == cols - 1:
            x2 = grid_w - right_margin

        # Compute row densities for this column
        densities: List[float] = []
        for row in range(rows):
            y1 = int(top_margin + row * cell_height)
            y2 = int(top_margin + (row + 1) * cell_height)
            if row == rows - 1:
                y2 = grid_h - bottom_margin

            cell = grid_binary[y1:y2, x1:x2]
            total_pixels = cell.shape[0] * cell.shape[1]
            density = cv2.countNonZero(cell) / float(total_pixels) if total_pixels > 0 else 0
            densities.append(density)

        mean_density = np.mean(densities)
        
        filled_rows: List[int] = []
        for r, d in enumerate(densities):
            # Check relative threshold (exceeds mean * 1.35) and noise floor (exceeds 0.20)
            if d > 0.20 and d > mean_density * 1.35:
                filled_rows.append(r)

        if len(filled_rows) == 1:
            answer_digits.append(str(filled_rows[0]))
        else:
            answer_digits.append("_")

    return "".join(answer_digits)


def read_numerical_blocks(
    images_dir: str = "images",
    block_indices: Optional[List[int]] = None,
    min_density: float = 0.20
) -> Dict[str, str]:
    """
    Loops through and reads numerical JEE question block images.

    Args:
        images_dir: Directory containing block image files.
        block_indices: List of numerical blocks to scan. Defaults to JEE standard range.
        min_density: Legacy density parameter.

    Returns:
        Dict mapping question block label to decoded string.
    """
    if block_indices is None:
        block_indices = [
            5, 6, 7, 8, 9,
            14, 15, 16, 17, 18,
            23, 24, 25, 26, 27
        ]

    import os
    results: Dict[str, str] = {}

    for index in block_indices:
        file_path = os.path.join(images_dir, f"block_{index}.jpg")
        if not os.path.exists(file_path):
            results[str(index)] = "_" * 7
            continue

        block_img = cv2.imread(file_path)
        try:
            answer = extract_numerical_answer(
                block_img=block_img,
                min_density=min_density
            )
            results[str(index)] = answer
        except Exception as e:
            results[str(index)] = "_" * 7

    return results
