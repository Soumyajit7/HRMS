from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="HRMS Lite API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
client = None
db = None

try:
    client = AsyncIOMotorClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=7000,
        connectTimeoutMS=10000,
        socketTimeoutMS=20000
    )
    db = client.hrms_lite
    print("MongoDB client initialized successfully!")
except Exception as e:
    print(f"Warning: Could not initialize MongoDB client: {e}")

@app.get("/")
async def root():
    return {"message": "HRMS Lite API is running"}

@app.get("/health")
async def health_check():
    if db is None:
        return {"status": "running", "database": "disconnected", "message": "API is running but database connection failed"}
    
    try:
        # Test database connection
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "degraded", "database": "connection failed", "error": str(e)}

# Import routes after app initialization to avoid circular imports
from routes import employee_routes, attendance_routes

app.include_router(employee_routes.router, prefix="/api/employees", tags=["employees"])
app.include_router(attendance_routes.router, prefix="/api/attendance", tags=["attendance"])