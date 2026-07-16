# ExamVision AI: Software Interface Specification (SIS)

**Document Ref**: EVAI-SIS-2026-V1  
**Status**: APPROVED / ACTIVE  

---

## 1. System Overview
ExamVision AI is an automated Optical Mark Recognition (OMR) evaluation system supporting JEE, NEET, and KCET exams. The application loads scanned sheets, performs skew correction, extracts regions of interest, and evaluates multiple-choice options (MCQ), student identity codes (Roll Numbers), and numerical bubble grids.

---

## 2. Module Responsibilities

### A. MCQ Reader (Developer A)
- **Responsibility**: Detect bubbled selections inside cropped multiple-choice blocks and output selected choice letters (A, B, C, D).

### B. Roll Number Reader (Developer B)
- **Responsibility**: Scan student registration codes inside designated card regions.

### C. Numerical Reader (Me)
- **Responsibility**: Read bubbled rows inside cropped integer grids and decode 7-digit strings.

### D. Pipeline Coordinator (Developer C)
- **Responsibility**: Direct image preprocessing, partition card locations, route crop arrays to readers, and combine results.

### E. Result Generator (Me)
- **Responsibility**: Aggregate student metrics and compile the output JSON schema to disk.

---

## 3. Interface Contracts

| Component | Input Type | Output Type | Expected Behavior |
| :--- | :--- | :--- | :--- |
| **MCQ Reader** | Image Matrix (`numpy.ndarray`) | `List[str]` | Decodes choices; missing bubbles returned as `"-"`. |
| **Roll Number Reader** | Image Matrix (`numpy.ndarray`) | `str` | Decodes digit registration keys; missing indices as `_`. |
| **Numerical Reader** | Image Matrix (`numpy.ndarray`) | `str` | Decodes 7 digit grids; outputs `_` for blank/multi-bubbles. |
| **Result Generator** | String Metadata + Reader Dictionaries | `Dict[str, Any]` | Compiles final answers payload and writes JSON to disk. |

---

## 4. Data Contracts
- **Image Inputs**: 2D Grayscale or 3D BGR matrix arrays (`numpy.ndarray`), warped and aligned.
- **Answer Identifiers**: All question keys mapped as index strings (`"1"`, `"2"`, `"3"`).
- **Result Output Path**: Saved to the local workspace destination `results/result.json`.

---

## 5. JSON Contract
The saved result payload must conform to the following schema format:

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

## 6. Error Handling Contract
- **Corrupted Inputs**: Readers must raise `ValueError` when encountering empty matrices.
- **Fail-Safe Returns**: During batch processing, reader failures should log the error and default individual values to unattempted metrics (`"-"` or `_`) rather than halting the entire processor loop.
- **Disk Failures**: The Result Generator must raise standard `IOError` or `OSError` if writes are blocked (e.g. permission locks).

---

## 7. Integration Sequence
The Pipeline Coordinator executes the following sequence:

```
[ Load Warped OMR Image ] 
          │
          ├────────► Call Roll Number Reader (passes warped image crop)
          │
          ├────────► Loop Question blocks (1 to 27)
          │                ├── If Numerical slot ➔ Call Numerical Reader (passes block crop)
          │                └── If MCQ slot       ➔ Call MCQ Reader (passes block crop)
          │
          ▼
[ Call Result Generator (compiles JSON structure) ]
```

---

## 8. Preconditions & Postconditions

### A. Crop Processing
- **Precondition**: Passed crops must represent aligned, upright regions of interest.
- **Postcondition**: Output values must be formatted as sanitized strings.

### B. Output Compilation
- **Precondition**: Evaluated dictionaries contains all scannable question boundaries.
- **Postcondition**: JSON is written to `results/result.json`.

---

## 9. Validation Requirements
- **Density Check**: Filled markings must exceed configurable pixel density ratios relative to the cell container.
- **JSON Structure**: Schema parameters must contain exact keys: `exam`, `roll_number`, `answers`, and `numerical_answers`.

---

## 10. Integration Checklist
- [ ] Reader modules isolated from blocking OpenCV UI calls (`imshow`, `waitKey`).
- [ ] Coordinator calls readers dynamically in memory.
- [ ] Answer schemas match index numbers.
- [ ] Result generator verifies folder existence dynamically.

---

## 11. Acceptance Criteria
1. The coordinator completes execution without terminal hangs or exceptions.
2. The output JSON corresponds to OMR sheet markings.
3. Blank questions or duplicate markings evaluate to `_` or `-`.

---

## 12. Future Compatibility Notes
- Keep coordinate calculations relative to input resolutions to protect modules from future sheet camera upgrades.
