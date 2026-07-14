# ExamVision AI - OMR Evaluation System

An enterprise-grade, frontend React application designed to manage, monitor, and analyze Offline OMR (Optical Mark Recognition) answer sheets in real-time. Built specifically for educational institutions and examination boards.

## Features

- **Secure Authentication**: Highly branded, split-screen login page with client-side validation.
- **Enterprise Dashboard**: A comprehensive hub featuring complex data visualizations (Bar, Pie, Area, Line charts) via Recharts.
- **Streamlined Configuration**: Create new exams by selecting the exam type, specifying student counts, and uploading a `.csv` answer key.
- **Live Scanning Simulation**: A 3-column live monitoring interface that mimics an active camera feed and evaluates sheets in real time.
- **Advanced Analytics**: Detailed paginated tables, score distribution metrics, and leaderboards.
- **Student Performance Reports**: Deep-dive individual reports featuring SVG Circular Progress rings, Radar charts for subject mastery, and detailed breakdown tabs.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6 (Lazy loaded with Suspense)
- **Styling:** Tailwind CSS (Utility-first, responsive)
- **Charting:** Recharts
- **Icons:** React Icons (Material Design)

## Folder Structure

```
examvision-ai/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── common/         # Layout headers, Pagination, ProtectedRoutes
│   │   ├── layout/         # Sidebar, Navbar
│   │   └── ui/             # Reusable Atoms: Button, Card, Table, Badge, Loader
│   ├── constants/          # routing.js, colors.js, navigation.js
│   ├── context/            # LayoutContext.js (State persistence)
│   ├── data/               # Simulated JSON backend data
│   ├── layouts/            # MainLayout.jsx (Wraps protected routes)
│   ├── pages/              # Module Pages (Dashboard, Scanner, Results, etc.)
│   └── services/           # Axios API instance and service placeholders
├── .env.example            # Environment variable template
└── package.json            # Dependencies
```

## Installation & How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/examvision-ai.git
   cd examvision-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and set your API Base URL (if applicable).
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## Project Screenshots

*(Add screenshots of your application here)*
- `Dashboard.png`
- `LiveScanner.png`
- `StudentReport.png`

## Future Backend Integration

The frontend architecture is deeply decoupled and ready for a backend REST API. 
To transition from dummy data to live data:
1. Review `FRONTEND_API_INTEGRATION.md` for endpoint mapping.
2. Update `src/services/api.js` to point `baseURL` to your active Python (Flask/FastAPI) backend.
3. Replace the local JSON imports in the page components with standard Axios calls originating from the `src/services/` directory.
