# ExamVision AI: OMR Numerical Module Integration Handoff Doc

This handbook serves as the official integration document for the **OMR Numerical Reader** and **Result Generator** modules of the **ExamVision AI** analysis engine.

---

## 1. Module Overview
The numerical evaluation sub-system comprises three primary files:

- **`scanner/numerical_reader.py`**:
  Contains the bubble density scanning algorithm, coordinate segmentation grid dividing logic, and JEE validation rule engine.
- **`scanner/result_generator.py`**:
  Aggregates multiple-choice options, scanned roll numbers, and evaluated numerical answers into the production JSON schema, saving it to disk.
- **`scanner/test_numerical.py`**:
  Our regression verification suite. Direct execution tests column density slicing, multi-fill checks, and JSON output generation.

---

## 2. Public APIs

### `scanner/numerical_reader.py`

#### A. `extract_numerical_answer(...)`
Calculates character answers for a single question crop block.
- **Signature**:
  ```python
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
  ) -> str
  ```
- **Returns**: A `7`-character evaluation string containing numbers `0-9` and `_` representing invalid slots.
- **Exceptions**: Raises `ValueError` if `block_img` is empty or holds invalid dimensions.
- **Example**:
  ```python
  import cv2
  from scanner.numerical_reader import extract_numerical_answer

  block = cv2.imread("images/block_5.jpg")
  ans_str = extract_numerical_answer(block)
  print(f"Decoded Answer: {ans_str}")  # Expect "1234567" or similar
  ```

#### B. `read_numerical_blocks(...)`
Loops over coordinates or folder indices to evaluate numerical answer arrays.
- **Signature**:
  ```python
  def read_numerical_blocks(
      images_dir: str = "images",
      block_indices: Optional[List[int]] = None,
      min_density: float = 0.20
  ) -> Dict[str, str]
  ```
- **Returns**: `Dict[str, str]` mapping block index string keys to the evaluated numeric values.
- **Example**:
  ```python
  from scanner.numerical_reader import read_numerical_blocks
  answers = read_numerical_blocks()
  ```

---

### `scanner/result_generator.py`

#### `save_result_json(...)`
Formatting compiler that writes results to disk.
- **Signature**:
  ```python
  def save_result_json(
      exam_type: str,
      roll_number: str,
      mcq_answers: Dict[str, str],
      numerical_answers: Dict[str, str],
      output_dir: str = "results",
      filename: str = "result.json"
  ) -> Dict[str, Any]
  ```
- **Returns**: `Dict[str, Any]` representing the generated payload.
- **Exceptions**: Raises `OSError` if creation of `output_dir` fails; raises `IOError` if serialization is blocked.
- **Example**:
  ```python
  from scanner.result_generator import save_result_json
  
  save_result_json("JEE", "2026CS101", {"1": "A"}, {"5": "1234567"})
  ```

---

## 3. Data Flow

The coordinate transformations map through the pipeline as shown below:

```
[ Warped BGR Sheet Matrix ] 
          │
          ▼  (Coord slice in answer_extractor.py)
[ BGR Numerical Block Image Crop Array ]
          │
          ▼  (extract_numerical_answer)
[ Convert Grayscale ➔ Gaussian Blur ➔ Adaptive Inverse Binary Mask ]
          │
          ▼  (Remove Margins ➔ Floating Coordinate Gridding)
[ Evaluate 7 Columns × 10 Rows cells density ]
          │
          ▼  (Apply JEE Exactly-One-Bubble Rules)
[ 7-char Decoded String Map (e.g. "345_20_") ]
          │
          ▼  (Aggregated by answer_extractor.py)
[ save_result_json invocation ] ➔ [ Write to results/result.json ]
```

---

## 4. Integration Guide
The coordinator developer can integrate these modules into the pipeline by updating `scanner/answer_extractor.py` as follows:

1. **Import** the methods:
   ```python
   from scanner.numerical_reader import extract_numerical_answer
   from scanner.result_generator import save_result_json
   ```
2. **Retrieve MCQ & Roll Number results** from teammate modules:
   ```python
   # mcq_answers = extract_mcq_answers(warped_image)
   # roll_number = extract_roll_number(warped_image)
   ```
3. **Loop numerical indexes** and compile the details:
   ```python
   numerical_answers = {}
   numerical_slots = {5, 6, 7, 8, 9, 14, 15, 16, 17, 18, 23, 24, 25, 26, 27}
   
   for i, (x, y, w, h) in enumerate(question_blocks):
       block_idx = i + 1
       if block_idx in numerical_slots:
           block_crop = answer_region[y:y+h, x:x+w]
           ans = extract_numerical_answer(block_crop)
           numerical_answers[str(block_idx)] = ans
   ```
4. **Export output JSON**:
   ```python
   save_result_json("JEE", roll_number, mcq_answers, numerical_answers)
   ```

---

## 5. Input Specifications
- **Image Data format**: 2D Grayscale or 3D BGR `numpy.ndarray`.
- **Dimensions**: Dynamic (scale independent). Grid is sliced using bounding proportion floats.
- **Gridding Layout**: 10 rows (representing digits `0` through `9`) × 7 columns (digit columns).
- **Default Crop Margins**: Titles: 26px top; bottom border: 5px; indices: 25px left; right border: 5px.

---

## 6. Output Specifications
- **Dictionary Map**:
  ```python
  {
      "5": "1234567",
      "6": "_345678"
  }
  ```
- **Generated Schema File (`results/result.json`)**:
  ```json
  {
      "exam": "JEE",
      "roll_number": "1234567890",
      "answers": {
          "1": "A",
          "2": "C"
      },
      "numerical_answers": {
          "5": "1234567",
          "6": "_345678"
      }
  }
  ```

---

## 7. Error Handling
- **Image validation**: `ValueError` is raised if `None` or empty matrices are encountered. Callers should capture this and issue scan warning alerts.
- **File System exceptions**: Writes are guarded by `OSError`/`IOError` catches block, protecting backend pipelines from disk failures.

---

## 8. Dependencies
- **Python**: $\ge 3.8$
- **OpenCV**: `opencv-python` ($\ge 4.5$)
- **NumPy**: `numpy` ($\ge 1.19$)
- **File library**: `json`, `os` (Standard package trees)

---

## 9. Testing Guide
To verify the implementation locally:
1. Run the test script:
   ```bash
   python scanner/test_numerical.py
   ```
2. Verify output console logs:
   - Evaluates coordinate layouts.
   - Asserts double-marked and blank bubbles yield `_`.
   - Asserts compiler serializes formatted result outputs.

---

## 10. Known Limitations
- **Not Environment Benchmarked**: Runtime performance has not been measured under heavy production loads.
- **Physical Feeds**: Checked only on mock/synthesized configurations. Actual camera variance (shadow patterns/wrinkles) has not been validated.
- **Rigid Offsets**: Dynamic margins (calculating borders in proportions rather than raw pixel indices) are suggested for future versions.

---

## 11. Merge Checklist
- [ ] Reader/Generator modules imported.
- [ ] Type constraints checked.
- [ ] Directory generation verified.
- [ ] No circular imports exist.
- [ ] Unit tests compilation passed.
- [ ] Production threshold benchmarks completed.

---

## 12. Deployment Notes
- **Threshold configuration**: Adjust `min_density` (default `0.20` or `20%`) depending on standard scanner contrast quality.
- **Headless Pipelines**: Keep blocking displays (`cv2.imshow`) isolated to dev modules. The main production loop must execute without window events.
