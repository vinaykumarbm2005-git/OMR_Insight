# ExamVision AI - Frontend API Integration Guide

This document outlines the expected REST API architecture for the ExamVision AI backend. It details the required endpoints, payloads, response schemas, and provides functional Axios examples to bridge the frontend UI to the backend Python services.

---

## 1. Authentication (Login)

**Component:** `Login.jsx`  
**Frontend Service Function:** `authService.login(credentials)`  

* **API Endpoint:** `/api/v1/auth/login`
* **HTTP Method:** `POST`
* **Request Body:**
  ```json
  {
    "email": "admin@examvision.ai",
    "password": "securepassword123"
  }
  ```
* **Response Format:**
  ```json
  {
    "status": "success",
    "data": {
      "token": "eyJhbGciOiJIUzI1...",
      "user": {
        "id": "USR-001",
        "name": "Admin User",
        "role": "admin"
      }
    }
  }
  ```
* **Expected Status Codes:** `200 OK`
* **Error Responses:** 
  * `401 Unauthorized` (Invalid credentials)
  * `400 Bad Request` (Missing fields)

**Axios Example:**
```javascript
const login = async (email, password) => {
  try {
    const response = await axios.post('/api/v1/auth/login', { email, password });
    localStorage.setItem('token', response.data.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
```

---

## 2. Create Exam

**Component:** `CreateExam.jsx`  
**Frontend Service Function:** `examService.createExam(examData)`  

* **API Endpoint:** `/api/v1/exams`
* **HTTP Method:** `POST`
* **Request Body:**
  ```json
  {
    "examType": "NEET",
    "numStudents": 150
  }
  ```
* **Response Format:**
  ```json
  {
    "status": "success",
    "data": {
      "examId": "EXM-7892",
      "message": "Exam created successfully. Awaiting answer key."
    }
  }
  ```
* **Expected Status Codes:** `201 Created`
* **Error Responses:** 
  * `400 Bad Request` (Validation error)
  * `401 Unauthorized`

**Axios Example:**
```javascript
const createExam = async (examType, numStudents) => {
  const response = await axios.post('/api/v1/exams', { examType, numStudents });
  return response.data.data.examId;
};
```

---

## 3. Upload Answer Key

**Component:** `CreateExam.jsx`  
**Frontend Service Function:** `examService.uploadAnswerKey(examId, file)`  

* **API Endpoint:** `/api/v1/exams/{examId}/answer-key`
* **HTTP Method:** `POST`
* **Content-Type:** `multipart/form-data`
* **Request Body:** `FormData` containing the `.csv` file.
* **Response Format:**
  ```json
  {
    "status": "success",
    "data": {
      "parsedQuestions": 180,
      "message": "Answer key processed and mapped."
    }
  }
  ```
* **Expected Status Codes:** `200 OK`
* **Error Responses:** 
  * `400 Bad Request` (Invalid CSV format / parse error)
  * `415 Unsupported Media Type` (Not a CSV file)

**Axios Example:**
```javascript
const uploadAnswerKey = async (examId, file) => {
  const formData = new FormData();
  formData.append('answerKey', file);

  const response = await axios.post(`/api/v1/exams/${examId}/answer-key`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
```

---

## 4. Start Scanner

**Component:** `Scanner.jsx`  
**Frontend Service Function:** `scannerService.startScanner(examId)`  

* **API Endpoint:** `/api/v1/scanner/start`
* **HTTP Method:** `POST`
* **Request Body:**
  ```json
  {
    "examId": "EXM-7892"
  }
  ```
* **Response Format:**
  ```json
  {
    "status": "success",
    "data": {
      "scannerState": "scanning",
      "message": "Camera initialized and evaluation started."
    }
  }
  ```
* **Expected Status Codes:** `200 OK`
* **Error Responses:** 
  * `500 Internal Server Error` (Camera not detected / OpenCV failure)
  * `404 Not Found` (Exam ID not found)

**Axios Example:**
```javascript
const startScanner = async (examId) => {
  const response = await axios.post('/api/v1/scanner/start', { examId });
  return response.data;
};
```

---

## 5. Scanner Status (Polling / SSE Alternative)

**Component:** `Scanner.jsx`  
**Frontend Service Function:** `scannerService.getScannerStatus(examId)`  
*Note: In production, consider WebSockets or SSE for real-time updates instead of HTTP Polling.*

* **API Endpoint:** `/api/v1/scanner/status/{examId}`
* **HTTP Method:** `GET`
* **Request Body:** `None`
* **Response Format:**
  ```json
  {
    "status": "success",
    "data": {
      "state": "scanning",
      "scannedCount": 45,
      "totalStudents": 150,
      "currentStudent": {
        "name": "Aarav Patel",
        "rollNumber": "RN-001"
      },
      "recentLog": "Sheet #45 Evaluated successfully."
    }
  }
  ```
* **Expected Status Codes:** `200 OK`
* **Error Responses:** 
  * `404 Not Found`

**Axios Example:**
```javascript
const pollScannerStatus = async (examId) => {
  const response = await axios.get(`/api/v1/scanner/status/${examId}`);
  return response.data.data;
};

// Polling interval usage:
// setInterval(() => pollScannerStatus(currentExamId).then(updateUI), 1500);
```

---

## 6. Results Dashboard

**Component:** `Results.jsx`  
**Frontend Service Function:** `analyticsService.getExamResults(examId)`  

* **API Endpoint:** `/api/v1/exams/{examId}/results`
* **HTTP Method:** `GET`
* **Request Body:** `None`
* **Query Parameters (Optional for filtering/pagination):**
  * `?page=1&limit=5&search=Aarav`
* **Response Format:**
  ```json
  {
    "status": "success",
    "data": {
      "examDetails": { ... },
      "summary": { "averageScore": 68.4, "passPercentage": 82, ... },
      "charts": { "scoreDistribution": [], "passFail": [] },
      "leaderboards": { "top": [], "bottom": [] },
      "students": [
        { "id": "STU001", "name": "Aarav", "score": 98, "status": "Excellent" }
      ]
    }
  }
  ```
* **Expected Status Codes:** `200 OK`
* **Error Responses:** 
  * `404 Not Found`

**Axios Example:**
```javascript
const fetchExamResults = async (examId, search = '', page = 1) => {
  const response = await axios.get(`/api/v1/exams/${examId}/results`, {
    params: { search, page, limit: 5 }
  });
  return response.data.data;
};
```

---

## 7. Student Details (Performance Report)

**Component:** `StudentDetails.jsx`  
**Frontend Service Function:** `analyticsService.getStudentReport(studentId)`  

* **API Endpoint:** `/api/v1/students/{studentId}/report`
* **HTTP Method:** `GET`
* **Request Body:** `None`
* **Response Format:**
  ```json
  {
    "status": "success",
    "data": {
      "profile": { "name": "Aarav Patel", "overallScore": 98, ... },
      "analytics": { "correct": 98, "incorrect": 2, ... },
      "charts": { "radar": [], "bar": [] },
      "correctAnswers": [],
      "incorrectAnswers": [],
      "weakAreas": [],
      "scanDetails": { "evaluationAccuracy": "99.99%", ... },
      "summary": { "insight": "Excellent Performance", ... }
    }
  }
  ```
* **Expected Status Codes:** `200 OK`
* **Error Responses:** 
  * `404 Not Found` (Student record not found)

**Axios Example:**
```javascript
const fetchStudentReport = async (studentId) => {
  const response = await axios.get(`/api/v1/students/${studentId}/report`);
  return response.data.data;
};
```
