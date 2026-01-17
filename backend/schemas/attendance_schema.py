from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum
from bson import ObjectId
from pydantic import validator

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
    
    @validator('date', pre=True)
    def convert_date_to_datetime(cls, v):
        if isinstance(v, date) and not isinstance(v, datetime):
            return datetime.combine(v, datetime.min.time())
        return v

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: Optional[str] = Field(alias="_id", default=None)
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
        use_enum_values = True

class AttendanceUpdate(BaseModel):
    status: Optional[AttendanceStatus] = None