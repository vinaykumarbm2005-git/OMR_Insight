# ExamVision AI: AI-Powered OMR Analytics System

ExamVision AI is an educational technology solution designed for institutions to automate the scanning, grading, and reporting of OMR (Optical Mark Recognition) answer sheets. It features computer vision components that decode numerical/MCQ blocks and publishes performance telemetry to help instructors track class progress and help students identify weak chapters or subject topics.

---

## 1. Project Features

*   **OMR Scanning Engine**: Initiates templates scanning via OpenCV (MCQ bubble detection & Numerical handwriting extraction).
*   **Template-Driven Evaluator**: Evaluates KCET & multi-layout configurations aligned to CSV uploads.
*   **Student Registry Manager**: Creates classroom cohorts and imports student lists per exam.
*   **Live Scanning Terminal**: Coordinates multipart file streams and displays dynamic status logs.
*   **Analytics Visualization**: Publishes class benchmarks, average scores, pass counts, overall rankings, and custom competency details.

---

## 2. Technology Stack

### Frontend Architecture
*   **Core**: React 18, React Router v6
*   **Styling**: Tailwind CSS (custom visual aesthetic design system)
*   **Icons**: React Icons (Material Design library)
*   **Data Visualization**: Recharts (radar charts, scatter plots, benchmark lines)
*   **Network Manager**: Axios (with global interceptors)

### Backend Architecture
*   **Frame**: Python Flask, Flask-CORS
*   **CV Engine**: OpenCV, NumPy
*   **Database**: Flask SQL-Alchemy database mapper

---

## 3. Folder Structure

```text
OMR_Insight/
├── backend/                  # Flask REST API
│   ├── app.py                # Server entry and route mapping
│   ├── controllers/          # Request handoffs
│   ├── database/             # SQLAlchemy schemas and DB config
│   ├── models/               # Model declarations
│   └── scanner/              # OpenCV reader modules
├── frontend/                 # Vite + React Web Application
│   ├── src/
│   │   ├── components/       # Common UI modules, Layouts, Cards
│   │   ├── constants/        # Route declarations
│   │   ├── services/         # API layers and Axios client
│   │   ├── pages/            # Login, Dashboard, Scanner Views
│   │   └── App.jsx           # Main coordinator and router
│   ├── vite.config.js        # Build specifications
│   └── package.json          # Dependencies
└── README.md                 # Project Documentation
```

---

## 4. Environment Configuration & Variables

### Frontend Setup
Create a `.env` file under the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Backend Setup
Under the `backend` folder, configuration parameters are managed via Python config files and system defaults.

---

## 5. Installation & Execution Guide

### Installing Dependencies

#### Backend
1. Initialize a Python virtual environment:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

#### Frontend
1. Change directory to frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Services

#### Start Backend
```bash
cd backend
python app.py
```
*Port default is: `http://localhost:5000`*

#### Start Frontend
```bash
cd frontend
npm run dev
```
*Will execute local development server on: `http://localhost:5173`*

---

## 6. Available Backend REST APIs

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/api/v1/auth/login` | Log in matching admin credentials |
| **Exams** | `POST` | `/api/v1/exams` | Create an exam profile |
| | `GET` | `/api/v1/exams` | Fetch all exams |
| | `GET` | `/api/v1/exams/<id>` | Fetch specific exam rules |
| | `POST` | `/api/v1/exams/<id>/answer-key` | Upload target OMR CSV answer key |
| **Students** | `POST` | `/api/v1/students` | Register a student profile |
| | `GET` | `/api/v1/students` | Retrieve student cohorts database |
| **OMR Scanner** | `POST` | `/api/v1/scanner/start` | Submit OMR image file |
| **Results** | `GET` | `/api/v1/results/exam/<id>` | Fetch class performance statistics |
| | `GET` | `/api/v1/results/student/<id>` | Fetch individual report scorecard |

---

## 7. Version 1 Scope, Limitations & Roadmap

### Supported Version 1 Scope
*   **Institutional Single-Tenant Login**: Authenticate matching static local system admin credentials.
*   **Exam Creation & Matching Student Registration**: Provision unique exams, import target cohort registries, and bind evaluation profiles.
*   **Asynchronous Scan Pipeline**: Submit raw OMR sheets and view live server parsing updates on the Terminal console.
*   **Live Evaluation Performance Dashboard**: Dynamically render score metrics, leaderboard rankings, and student reports.

### Known Limitations
*   *Static Admin Profile*: User avatars and settings directories are locked.
*   *No Self-Service Password Reset*: Forgot password functions are unavailable.
*   *Simulated Metrics*: Scanning stats (average execution speed, accuracy scores) are estimated indicators.
*   *Local Exports*: Exporting student reports as PDF or CSV file targets is out of scope.

### Roadmap (Future Enhancements)
*   Integrate SMTP servers for secure self-service password reset flows.
*   Add dynamic file compilers to generate live PDF/CSV outputs.
*   Enable multi-tenant student login access to view report portals.
*   Incorporate real-time telemetry metrics using WebSockets to display instant scanner speeds.
