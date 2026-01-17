# HRMS Lite Backend

FastAPI backend for the HRMS Lite application with MongoDB integration.

## Setup Instructions

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment variables:**
Copy `.env.example` to `.env` and update with your MongoDB Atlas credentials:
```bash
cp .env.example .env
```

Update the `MONGODB_URI` in `.env` with your MongoDB Atlas connection string.

3. **Run the application:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## Endpoints

### Employee Management
- `POST /api/employees/` - Create new employee
- `GET /api/employees/` - Get all employees
- `GET /api/employees/{employee_id}` - Get employee by ID
- `PUT /api/employees/{employee_id}` - Update employee
- `DELETE /api/employees/{employee_id}` - Delete employee

### Attendance Management
- `POST /api/attendance/` - Mark attendance
- `GET /api/attendance/` - Get attendance records (with filters)
- `GET /api/attendance/employee/{employee_id}` - Get employee attendance
- `PUT /api/attendance/{attendance_id}` - Update attendance
- `DELETE /api/attendance/{attendance_id}` - Delete attendance record

## Database Collections

- `employees` - Stores employee information
- `attendance` - Stores attendance records