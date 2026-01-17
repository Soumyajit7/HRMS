from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum
from bson import ObjectId

# Simplified ObjectId handling
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"

class AttendanceBase(BaseModel):
    employee_id: str = Field(..., min_length=1)
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: Optional[PyObjectId] = Field(alias="_id")
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        use_enum_values = True

class AttendanceUpdate(BaseModel):
    status: Optional[AttendanceStatus] = None