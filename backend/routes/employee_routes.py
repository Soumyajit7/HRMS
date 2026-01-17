from fastapi import APIRouter, HTTPException, status
from typing import List
from schemas.employee_schema import EmployeeCreate, Employee, EmployeeUpdate
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

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

@router.post("/", response_model=Employee, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    """Create a new employee"""
    # Check if employee_id already exists
    existing_employee = await db.employees.find_one({"employee_id": employee.employee_id})
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID already exists"
        )
    
    # Check if email already exists
    existing_email = await db.employees.find_one({"email": employee.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    
    employee_dict = employee.dict()
    result = await db.employees.insert_one(employee_dict)
    created_employee = await db.employees.find_one({"_id": result.inserted_id})
    
    # Convert ObjectId to string for JSON serialization
    created_employee['_id'] = str(created_employee['_id'])
    return Employee(**created_employee)

@router.get("/", response_model=List[Employee])
async def get_employees(skip: int = 0, limit: int = 100):
    """Get all employees with pagination"""
    employees_cursor = db.employees.find().skip(skip).limit(limit)
    employees = await employees_cursor.to_list(length=limit)
    # Convert ObjectId to string for each employee
    for employee in employees:
        employee['_id'] = str(employee['_id'])
    return [Employee(**employee) for employee in employees]

@router.get("/{employee_id}", response_model=Employee)
async def get_employee(employee_id: str):
    """Get employee by employee_id"""
    employee = await db.employees.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    # Convert ObjectId to string
    employee['_id'] = str(employee['_id'])
    return Employee(**employee)

@router.put("/{employee_id}", response_model=Employee)
async def update_employee(employee_id: str, employee_update: EmployeeUpdate):
    """Update employee by employee_id"""
    # Check if employee exists
    existing_employee = await db.employees.find_one({"employee_id": employee_id})
    if not existing_employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Check if new email already exists (if email is being updated)
    if employee_update.email and employee_update.email != existing_employee["email"]:
        email_exists = await db.employees.find_one({"email": employee_update.email})
        if email_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )
    
    # Update employee
    update_data = {k: v for k, v in employee_update.dict().items() if v is not None}
    if update_data:
        await db.employees.update_one(
            {"employee_id": employee_id},
            {"$set": update_data}
        )
    
    updated_employee = await db.employees.find_one({"employee_id": employee_id})
    # Convert ObjectId to string
    updated_employee['_id'] = str(updated_employee['_id'])
    return Employee(**updated_employee)

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    """Delete employee by employee_id"""
    # Check if employee exists
    existing_employee = await db.employees.find_one({"employee_id": employee_id})
    if not existing_employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Delete employee
    await db.employees.delete_one({"employee_id": employee_id})
    return