from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from schemas.attendance_schema import AttendanceCreate, Attendance, AttendanceUpdate
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from datetime import date, datetime

load_dotenv()
router = APIRouter()

# Get database connection
MONGODB_URI = os.getenv("MONGODB_URI")
client = AsyncIOMotorClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=7000,
    connectTimeoutMS=10000,
    socketTimeoutMS=20000
)
db = client.hrms_lite

@router.post("/", response_model=Attendance, status_code=status.HTTP_201_CREATED)
async def create_attendance(attendance: AttendanceCreate):
    """Mark attendance for an employee"""
    # Check if employee exists
    employee = await db.employees.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee not found"
        )
    
    # Convert date to datetime for MongoDB
    from datetime import datetime
    attendance_date = datetime.combine(attendance.date, datetime.min.time())
    
    # Check if attendance already exists for this employee on this date
    existing_attendance = await db.attendance.find_one({
        "employee_id": attendance.employee_id,
        "date": attendance_date
    })
    
    if existing_attendance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already marked for this employee on this date"
        )
    
    attendance_dict = attendance.dict()
    attendance_dict['date'] = attendance_date  # Use the converted datetime
    result = await db.attendance.insert_one(attendance_dict)
    created_attendance = await db.attendance.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for JSON serialization
    created_attendance['_id'] = str(created_attendance['_id'])
    return Attendance(**created_attendance)

@router.get("/", response_model=List[Attendance])
async def get_attendance(
    employee_id: Optional[str] = Query(None, description="Filter by employee ID"),
    date_from: Optional[date] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: Optional[date] = Query(None, description="Filter to date (YYYY-MM-DD)")
):
    """Get attendance records with optional filtering"""
    query = {}
    
    if employee_id:
        # Verify employee exists
        employee = await db.employees.find_one({"employee_id": employee_id})
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee not found"
            )
        query["employee_id"] = employee_id
    
    if date_from and date_to:
        query["date"] = {"$gte": date_from, "$lte": date_to}
    elif date_from:
        query["date"] = {"$gte": date_from}
    elif date_to:
        query["date"] = {"$lte": date_to}
    
    attendance_cursor = db.attendance.find(query).sort("date", -1)
    attendance_records = await attendance_cursor.to_list(length=1000)
    # Convert ObjectId to string for each record
    for record in attendance_records:
        record['_id'] = str(record['_id'])
    return [Attendance(**record) for record in attendance_records]

@router.get("/employee/{employee_id}", response_model=List[Attendance])
async def get_employee_attendance(employee_id: str):
    """Get attendance records for a specific employee"""
    # Check if employee exists
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    attendance_cursor = db.attendance.find({"employee_id": employee_id}).sort("date", -1)
    attendance_records = await attendance_cursor.to_list(length=1000)
    # Convert ObjectId to string for each record
    for record in attendance_records:
        record['_id'] = str(record['_id'])
    return [Attendance(**record) for record in attendance_records]

@router.put("/{attendance_id}", response_model=Attendance)
async def update_attendance(attendance_id: str, attendance_update: AttendanceUpdate):
    """Update attendance record"""
    # Check if attendance exists
    existing_attendance = await db.attendance.find_one({"_id": attendance_id})
    if not existing_attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    # Update attendance
    update_data = {k: v for k, v in attendance_update.dict().items() if v is not None}
    if update_data:
        await db.attendance.update_one(
            {"_id": attendance_id},
            {"$set": update_data}
        )
    
    updated_attendance = await db.attendance.find_one({"_id": attendance_id})
    # Convert ObjectId to string
    updated_attendance['_id'] = str(updated_attendance['_id'])
    return Attendance(**updated_attendance)

@router.delete("/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attendance(attendance_id: str):
    """Delete attendance record"""
    # Check if attendance exists
    existing_attendance = await db.attendance.find_one({"_id": attendance_id})
    if not existing_attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    # Delete attendance
    await db.attendance.delete_one({"_id": attendance_id})
    return