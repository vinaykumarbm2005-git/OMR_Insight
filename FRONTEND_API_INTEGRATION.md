# ExamVision AI: Frontend-Backend API Integration Map

This document outlines the API contracts and service mappings utilized by the React application in Version 1.

---

## 1. Authentication

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/v1/auth/login`
*   **Request Payload**:
    ```json
    {
      "username": "admin",
      "password": "admin123"
    }
    ```
*   **Response Payload (Success)**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "token": "eyJhbGciOiJIUzI1...",
        "user": {
          "id": 1,
          "username": "admin",
          "email": "admin@examvision.ai"
        }
      }
    }
    ```
*   **Frontend Page**: `Login.jsx`
*   **Service Layer used**: `authService.js` (`authService.login`)

---

## 2. Dashboard Analytics

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/v1/exams`
*   **Request Payload**: None *(Bearer token attached via shared Axios interceptor)*
*   **Response Payload (Success)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "title": "KCET Practice exam",
          "exam_type": "KCET",
          "total_questions": 60,
          "created_at": "2026-07-16T15:20:00Z"
        }
      ]
    }
    ```
*   **Frontend Page**: `Dashboard.jsx`
*   **Service Layer used**: `examService.js` (`getExams`)

---

## 3. Create Exam

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/v1/exams`
*   **Request Payload**:
    ```json
    {
      "title": "NEET Mock 1",
      "exam_type": "NEET",
      "total_questions": 180
    }
    ```
*   **Response (Success)**:
    ```json
    {
      "success": true,
      "message": "Exam created successfully",
      "data": {
        "id": 12,
        "title": "NEET Mock 1",
        "exam_type": "NEET",
        "total_questions": 180
      }
    }
    ```
*   **Frontend Page**: `CreateExam.jsx`
*   **Service Layer used**: `examService.js` (`createExam`)

---

## 4. Answer Key CSV Upload

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/v1/exams/<id>/answer-key`
*   **Request Payload**: Multipart Form Data containing CSV template file.
*   **Response (Success)**:
    ```json
    {
      "success": true,
      "message": "Answer key uploaded successfully"
    }
    ```
*   **Frontend Page**: `CreateExam.jsx`
*   **Service Layer used**: `examService.js` (`uploadAnswerKey`)

---

## 5. Student Cohort Management

### A. Register Student
*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/v1/students`
*   **Request Payload**:
    ```json
    {
      "name": "Arjun Kumar",
      "roll_number": "KCET045",
      "exam_id": 12
    }
    ```
*   **Response (Success)**:
    ```json
    {
      "success": true,
      "message": "Student created successfully",
      "data": {
        "id": 8,
        "name": "Arjun Kumar",
        "roll_number": "KCET045",
        "exam_id": 12
      }
    }
    ```
*   **Frontend Page**: `CreateExam.jsx`
*   **Service Layer used**: `studentService.js` (`studentService.createStudent`)

### B. List Students
*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/v1/students`
*   **Request**: None
*   **Response**: Array of registered student data elements.
*   **Frontend Page**: `CreateExam.jsx`
*   **Service Layer used**: `studentService.js` (`studentService.getStudents`)

---

## 6. OMR Scanner Evaluation

*   **HTTP Method**: `POST`
*   **Endpoint**: `/api/v1/scanner/start`
*   **Request Payload**: Multipart Form Data:
    - `image`: OMR File object
    - `exam_type`: String (e.g. `KCET`)
*   **Response (Success)**:
    ```json
    {
      "success": true,
      "message": "Scanning started",
      "data": {
        "status": "processing",
        "exam_id": 12,
        "student_id": 8,
        "roll_number": "KCET045",
        "score": 45
      }
    }
    ```
*   **Frontend Page**: `Scanner.jsx`
*   **Service Layer used**: `scannerService.js` (`startScan`)

---

## 7. Results Dashboard

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/v1/results/exam/<id>`
*   **Request**: None
*   **Response (Success)**:
    ```json
    {
      "success": true,
      "data": {
        "exam": {
          "title": "KCET Practice exam",
          "exam_type": "KCET"
        },
        "results": [
          {
            "student_id": 8,
            "student_name": "Arjun Kumar",
            "roll_number": "KCET045",
            "score": 45,
            "percentage": 75,
            "correct_answers": 45,
            "incorrect_answers": 15,
            "unattempted_questions": 0
          }
        ]
      }
    }
    ```
*   **Frontend Page**: `Results.jsx`
*   **Service Layer used**: `scannerService.js` (`getExamResults`)

---

## 8. Student Performance Details

*   **HTTP Method**: `GET`
*   **Endpoint**: `/api/v1/results/student/<id>`
*   **Request**: None
*   **Response**:
    ```json
    {
      "success": true,
      "data": {
        "student": {
          "name": "Arjun Kumar",
          "roll_number": "KCET045"
        },
        "exam": {
          "title": "KCET Practice exam",
          "exam_type": "KCET"
        },
        "result": {
          "score": 45,
          "correct_answers": 45,
          "incorrect_answers": 15,
          "unattempted_questions": 0
        }
      }
    }
    ```
*   **Frontend Page**: `StudentDetails.jsx`
*   **Service Layer used**: `studentService.js` (`studentService.getStudentReport`)
