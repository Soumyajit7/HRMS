# HRMS Lite - Human Resource Management System

A lightweight HRMS application built with React frontend and FastAPI backend using MongoDB Atlas.

## Features

### Employee Management
- Add new employees with unique employee ID, name, email, and department
- View list of all employees
- Edit employee details
- Delete employees

### Attendance Management
- Mark daily attendance (Present/Absent) for employees
- View attendance records with filtering options
- Filter by employee, date range
- Edit and delete attendance records
- Summary statistics showing present/absent counts

## Tech Stack

**Frontend:**
- React 18
- Vite (bundler)
- Axios (HTTP client)
- Custom CSS with utility classes (Tailwind CSS removed)

**Backend:**
- FastAPI
- MongoDB Atlas
- Motor (async MongoDB driver)
- Pydantic (data validation)

## Prerequisites

- Node.js 16+
- Python 3.8+
- MongoDB Atlas account

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Configure MongoDB connection:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB Atlas credentials

4. Run the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8002
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Project Structure

```
HRMS/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── routes/
│   │   ├── employee_routes.py
│   │   └── attendance_routes.py
│   ├── schemas/
│   │   ├── employee_schema.py
│   │   └── attendance_schema.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── _redirects           # Routing redirects for deployment
    ├── src/
    │   ├── components/
    │   │   ├── EmployeeForm.jsx
    │   │   ├── EmployeeTable.jsx
    │   │   ├── AttendanceForm.jsx
    │   │   ├── AttendanceTable.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── EmployeeManagement.jsx
    │   │   └── AttendanceManagement.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3001` in your browser
3. Add employees first using the Employee Management section
4. Mark attendance using the Attendance Management section
5. Use filters to view specific attendance records

## Key Features Implemented

✅ Employee CRUD operations
✅ Attendance marking and tracking
✅ Data validation on both frontend and backend
✅ Error handling with user-friendly messages
✅ Responsive UI with clean design
✅ Loading states and empty states
✅ Form validation
✅ Date filtering for attendance records
✅ Present/Absent statistics
✅ MongoDB Atlas integration
✅ Enhanced button styling with hover effects
✅ Proper cursor pointers for interactive elements

## Assumptions

- Single admin user (no authentication required)
- All operations are assumed to be performed by an authorized admin
- Employee IDs are unique and cannot be changed after creation
- Attendance can only be marked once per employee per date
- Simple department field (no separate department management)

## Deployment Notes

For production deployment:
- Update API base URL in frontend `src/utils/api.js`
- Configure proper CORS settings in backend
- Set up environment variables securely
- Use production build for frontend (`npm run build`)
- The `_redirects` file handles client-side routing for static hosting