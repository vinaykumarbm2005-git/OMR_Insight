import numpy as np
import cv2
from numerical_reader import extract_numerical_answer
from result_generator import save_result_json


def test_numerical_evaluation():
    print("Running OMR Numerical Detector verification test...")

    # Define standard dimensions
    # Grid area: 100 height x 70 width
    # Margins: top 26, bottom 5, left 25, right 5
    # Total image size: height = 131, width = 100
    h_m, w_m = 131, 100
    crop_top, crop_bottom, crop_left, crop_right = 26, 5, 25, 5

    grid_h = h_m - crop_top - crop_bottom
    grid_w = w_m - crop_left - crop_right

    # Step 1: Create a white grid image (white background, BGR)
    # Since the parser converts color to gray and adaptiveThreshold creates an inverse mask
    # (where black background paper is 0 and bubble markings/pen strokes are 255),
    # we simulate the binary inverse matrix directly:
    # 0 = uninked paper, 255 = inked pen stroke bubble markings.
    mock_inverse_mask = np.zeros((h_m, w_m), dtype=np.uint8)

    cell_width = grid_w / 7.0
    cell_height = grid_h / 10.0

    # We fill bubble indexes:
    # Col 0: Row 3 filled (should evaluate to "3")
    # Col 1: Row 4 filled (should evaluate to "4")
    # Col 2: Row 5 filled (should evaluate to "5")
    # Col 3: No rows filled (should evaluate to "_")
    # Col 4: Row 2 filled (should evaluate to "2")
    # Col 5: Row 0 filled (should evaluate to "0")
    # Col 6: Row 8 filled AND Row 9 filled (multiple filled, should evaluate to "_")
    fill_patterns = {
        0: [3],
        1: [4],
        2: [5],
        3: [],
        4: [2],
        5: [0],
        6: [8, 9]  # Double bubble test
    }

    for col, rows in fill_patterns.items():
        x1 = int(crop_left + col * cell_width)
        x2 = int(crop_left + (col + 1) * cell_width)
        
        for row in rows:
            y1 = int(crop_top + row * cell_height)
            y2 = int(crop_top + (row + 1) * cell_height)

            # Ink the bubble centered within the cell boundaries (using filled circle)
            # Make sure it fills at least 30% of the cell area (surpassing 20% min_density)
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2
            r = min(x2 - x1, y2 - y1) // 3
            cv2.circle(mock_inverse_mask, (cx, cy), r, 255, -1)

    # Since extract_numerical_answer runs adaptiveThreshold internally on BGR/Gray input,
    # we convert our inverse mask 255s to black (0) and 0s to white (255) to represent
    # a standard paper image (where ink is black on a white page).
    mock_page = 255 - mock_inverse_mask

    # Run the extractor using standard Jee configurations
    decoded_string = extract_numerical_answer(
        block_img=mock_page,
        min_density=0.15
    )

    print(f"Decoded Answer String: '{decoded_string}'")
    assert decoded_string == "345_20_", f"Assertion failure: expected '345_20_' but got {decoded_string}"

    print("Algorithm Verification: SUCCESS!")

    # Step 2: Test JSON result rendering
    print("Verifying result generator JSON serialization...")
    mcq_answers = {"1": "A", "2": "C", "3": "D"}
    numerical_answers = {"5": "1234567", "6": decoded_string}

    saved_payload = save_result_json(
        exam_type="JEE",
        roll_number="4GW23CS099",
        mcq_answers=mcq_answers,
        numerical_answers=numerical_answers,
        output_dir="test_results"
    )

    print("Generated Payload:", saved_payload)
    assert saved_payload["exam"] == "JEE"
    assert saved_payload["roll_number"] == "4GW23CS099"
    assert saved_payload["numerical_answers"]["6"] == "345_20_"

    # Cleanup temp folder and file
    import os
    if os.path.exists("test_results/result.json"):
        os.remove("test_results/result.json")
    if os.path.exists("test_results"):
        os.rmdir("test_results")

    print("JSON Rendering Verification: SUCCESS!")


if __name__ == "__main__":
    test_numerical_evaluation()
