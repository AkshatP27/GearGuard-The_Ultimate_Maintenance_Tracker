# 🔧 GearGuard Backend Development Guide
## Python + Supabase | Hackathon Edition (5-Hour Timeline)

---

## 🎯 Executive Summary

**Tech Stack:**
- **Backend Framework:** FastAPI (Python) - Fast, modern, async-ready
- **Database:** Supabase (PostgreSQL with real-time capabilities)
- **Authentication:** Supabase Auth (built-in)
- **Storage:** Supabase Storage (for equipment images/documents)
- **Deployment:** Supabase (backend), Vercel/Netlify (frontend)

**Timeline:** 5 hours total development time
- Backend: 2.5 hours
- Frontend: 2 hours  
- Integration & Testing: 0.5 hours

---

## 📋 Core Features Analysis (From Project Requirements)

### Phase 1: MVP Features (Must-Have - 5 Hours)
Based on the Excalidraw mockups and project goals:

1. **Authentication System** (30 min)
   - User registration (Technicians, Managers, Admin)
   - Login/Logout
   - Demo credentials
   - Role-based access control (RBAC)

2. **Equipment Management** (45 min)
   - CRUD operations for equipment
   - Equipment categorization
   - Status tracking (Operational, Under Maintenance, Retired)
   - Basic search and filtering

3. **Maintenance Tracking** (60 min)
   - Create maintenance tasks
   - Assign tasks to technicians
   - Update task status (Pending, In Progress, Completed)
   - Due date tracking
   - Priority levels (High, Medium, Low)

4. **Dashboard Data** (30 min)
   - Equipment statistics
   - Maintenance overview
   - Upcoming tasks
   - Alerts for overdue maintenance

5. **Team Management** (15 min)
   - List team members
   - View technician assignments
   - Basic user profiles

### Phase 2: Nice-to-Have (Post-Hackathon)
- Maintenance history and analytics
- File attachments for equipment
- Notification system
- Advanced reporting
- Equipment QR code generation

---

## 🗄️ Database Schema Design

### Supabase Tables Structure

#### 1. **profiles** (extends auth.users)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'technician')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

#### 2. **equipment**
```sql
CREATE TABLE equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  equipment_type TEXT NOT NULL, -- 'Machinery', 'Vehicle', 'Tool', 'Electronics'
  model TEXT,
  serial_number TEXT UNIQUE,
  manufacturer TEXT,
  purchase_date DATE,
  warranty_expiry DATE,
  status TEXT NOT NULL DEFAULT 'operational' 
    CHECK (status IN ('operational', 'under_maintenance', 'retired', 'out_of_service')),
  location TEXT,
  description TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_type ON equipment(equipment_type);
CREATE INDEX idx_equipment_created_by ON equipment(created_by);

-- Enable RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Equipment visible to authenticated users"
  ON equipment FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers and admins can create equipment"
  ON equipment FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Managers and admins can update equipment"
  ON equipment FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );
```

#### 3. **maintenance_tasks**
```sql
CREATE TABLE maintenance_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('preventive', 'corrective', 'inspection', 'repair')),
  priority TEXT NOT NULL DEFAULT 'medium' 
    CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id) NOT NULL,
  scheduled_date DATE NOT NULL,
  due_date DATE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_maintenance_status ON maintenance_tasks(status);
CREATE INDEX idx_maintenance_priority ON maintenance_tasks(priority);
CREATE INDEX idx_maintenance_assigned ON maintenance_tasks(assigned_to);
CREATE INDEX idx_maintenance_equipment ON maintenance_tasks(equipment_id);
CREATE INDEX idx_maintenance_due_date ON maintenance_tasks(due_date);

-- Enable RLS
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Maintenance tasks visible to authenticated users"
  ON maintenance_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers and admins can create tasks"
  ON maintenance_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Assigned technicians can update their tasks"
  ON maintenance_tasks FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );
```

#### 4. **maintenance_logs** (Activity History)
```sql
CREATE TABLE maintenance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES maintenance_tasks(id) ON DELETE CASCADE NOT NULL,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
  performed_by UUID REFERENCES profiles(id) NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_logs_task ON maintenance_logs(task_id);
CREATE INDEX idx_logs_equipment ON maintenance_logs(equipment_id);

-- Enable RLS
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logs visible to authenticated users"
  ON maintenance_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert logs"
  ON maintenance_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = performed_by);
```

---

## 🚀 Backend Implementation (Python + FastAPI)

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration and environment variables
│   ├── database.py             # Supabase client initialization
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── equipment.py        # Pydantic models for equipment
│   │   ├── maintenance.py      # Pydantic models for maintenance
│   │   └── user.py             # Pydantic models for users
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── equipment.py        # Equipment CRUD endpoints
│   │   ├── maintenance.py      # Maintenance task endpoints
│   │   ├── dashboard.py        # Dashboard statistics endpoints
│   │   └── team.py             # Team management endpoints
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py     # Authentication business logic
│   │   ├── equipment_service.py
│   │   ├── maintenance_service.py
│   │   └── dashboard_service.py
│   │
│   └── middleware/
│       ├── __init__.py
│       └── auth_middleware.py  # JWT verification, role checks
│
├── requirements.txt
├── .env.example
└── README.md
```

### Step-by-Step Implementation

#### **Step 1: Setup & Configuration (10 min)**

**requirements.txt**
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
supabase==2.3.4
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

**app/config.py**
```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_KEY: str
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "GearGuard API"
    VERSION: str = "1.0.0"
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://yourdomain.com"
    ]
    
    # Demo Credentials
    DEMO_EMAIL: str = "demo@gearguard.com"
    DEMO_PASSWORD: str = "demo123"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()
```

**.env.example**
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# API Configuration
API_V1_PREFIX=/api/v1
PROJECT_NAME=GearGuard API
VERSION=1.0.0
```

#### **Step 2: Supabase Client Setup (5 min)**

**app/database.py**
```python
from supabase import create_client, Client
from app.config import get_settings

settings = get_settings()

# Initialize Supabase client
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_KEY
)

def get_supabase() -> Client:
    """Dependency for getting Supabase client"""
    return supabase
```

#### **Step 3: Pydantic Models (15 min)**

**app/models/user.py**
```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    TECHNICIAN = "technician"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    avatar_url: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
```

**app/models/equipment.py**
```python
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from enum import Enum

class EquipmentType(str, Enum):
    MACHINERY = "Machinery"
    VEHICLE = "Vehicle"
    TOOL = "Tool"
    ELECTRONICS = "Electronics"

class EquipmentStatus(str, Enum):
    OPERATIONAL = "operational"
    UNDER_MAINTENANCE = "under_maintenance"
    RETIRED = "retired"
    OUT_OF_SERVICE = "out_of_service"

class EquipmentBase(BaseModel):
    name: str
    equipment_type: EquipmentType
    model: Optional[str] = None
    serial_number: Optional[str] = None
    manufacturer: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_expiry: Optional[date] = None
    status: EquipmentStatus = EquipmentStatus.OPERATIONAL
    location: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    equipment_type: Optional[EquipmentType] = None
    model: Optional[str] = None
    status: Optional[EquipmentStatus] = None
    location: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None

class EquipmentResponse(EquipmentBase):
    id: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

**app/models/maintenance.py**
```python
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from enum import Enum
from decimal import Decimal

class TaskType(str, Enum):
    PREVENTIVE = "preventive"
    CORRECTIVE = "corrective"
    INSPECTION = "inspection"
    REPAIR = "repair"

class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class MaintenanceTaskBase(BaseModel):
    equipment_id: str
    title: str
    description: Optional[str] = None
    task_type: TaskType
    priority: Priority = Priority.MEDIUM
    scheduled_date: date
    due_date: date
    estimated_hours: Optional[Decimal] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None

class MaintenanceTaskCreate(MaintenanceTaskBase):
    pass

class MaintenanceTaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[Priority] = None
    assigned_to: Optional[str] = None
    completed_date: Optional[datetime] = None
    actual_hours: Optional[Decimal] = None
    notes: Optional[str] = None

class MaintenanceTaskResponse(MaintenanceTaskBase):
    id: str
    status: TaskStatus
    created_by: str
    completed_date: Optional[datetime] = None
    actual_hours: Optional[Decimal] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

#### **Step 4: Authentication Middleware (15 min)**

**app/middleware/auth_middleware.py**
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import get_supabase
from app.models.user import UserRole

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Verify JWT token and get current user"""
    supabase = get_supabase()
    
    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(credentials.credentials)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        return user.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}"
        )

async def require_role(allowed_roles: list[UserRole]):
    """Dependency to check user role"""
    async def role_checker(current_user = Depends(get_current_user)):
        # Get user profile from database
        supabase = get_supabase()
        profile = supabase.table("profiles")\
            .select("*")\
            .eq("id", current_user.id)\
            .single()\
            .execute()
        
        if not profile.data or profile.data.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        
        return current_user
    
    return role_checker
```

#### **Step 5: API Endpoints (60 min)**

**app/routers/auth.py**
```python
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserLogin, Token, UserResponse
from app.database import get_supabase
from app.config import get_settings

router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """Register a new user"""
    supabase = get_supabase()
    
    try:
        # Create auth user
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "full_name": user_data.full_name,
                    "role": user_data.role
                }
            }
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User registration failed"
            )
        
        # Create profile
        profile = supabase.table("profiles").insert({
            "id": auth_response.user.id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "role": user_data.role
        }).execute()
        
        return {
            "access_token": auth_response.session.access_token,
            "user": UserResponse(**profile.data[0])
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """User login"""
    supabase = get_supabase()
    
    # Check for demo credentials
    if (credentials.email == settings.DEMO_EMAIL and 
        credentials.password == settings.DEMO_PASSWORD):
        return {
            "access_token": "demo_token_for_frontend",
            "user": UserResponse(
                id="demo-user-id",
                email=settings.DEMO_EMAIL,
                full_name="Demo User",
                role="admin",
                created_at=datetime.now()
            )
        }
    
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Get profile
        profile = supabase.table("profiles")\
            .select("*")\
            .eq("id", auth_response.user.id)\
            .single()\
            .execute()
        
        return {
            "access_token": auth_response.session.access_token,
            "user": UserResponse(**profile.data)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

@router.post("/logout")
async def logout(current_user = Depends(get_current_user)):
    """User logout"""
    supabase = get_supabase()
    supabase.auth.sign_out()
    return {"message": "Successfully logged out"}
```

**app/routers/equipment.py**
```python
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models.equipment import EquipmentCreate, EquipmentUpdate, EquipmentResponse
from app.models.user import UserRole
from app.database import get_supabase
from app.middleware.auth_middleware import get_current_user, require_role

router = APIRouter(prefix="/equipment", tags=["Equipment"])

@router.get("", response_model=List[EquipmentResponse])
async def get_all_equipment(
    status_filter: str = None,
    current_user = Depends(get_current_user)
):
    """Get all equipment with optional status filter"""
    supabase = get_supabase()
    
    query = supabase.table("equipment").select("*")
    
    if status_filter:
        query = query.eq("status", status_filter)
    
    result = query.execute()
    return result.data

@router.get("/{equipment_id}", response_model=EquipmentResponse)
async def get_equipment(
    equipment_id: str,
    current_user = Depends(get_current_user)
):
    """Get specific equipment by ID"""
    supabase = get_supabase()
    
    result = supabase.table("equipment")\
        .select("*")\
        .eq("id", equipment_id)\
        .single()\
        .execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    return result.data

@router.post("", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
async def create_equipment(
    equipment: EquipmentCreate,
    current_user = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Create new equipment (Manager/Admin only)"""
    supabase = get_supabase()
    
    equipment_data = equipment.model_dump()
    equipment_data["created_by"] = current_user.id
    
    result = supabase.table("equipment").insert(equipment_data).execute()
    return result.data[0]

@router.put("/{equipment_id}", response_model=EquipmentResponse)
async def update_equipment(
    equipment_id: str,
    equipment: EquipmentUpdate,
    current_user = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Update equipment (Manager/Admin only)"""
    supabase = get_supabase()
    
    update_data = equipment.model_dump(exclude_unset=True)
    
    result = supabase.table("equipment")\
        .update(update_data)\
        .eq("id", equipment_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    return result.data[0]

@router.delete("/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_equipment(
    equipment_id: str,
    current_user = Depends(require_role([UserRole.ADMIN]))
):
    """Delete equipment (Admin only)"""
    supabase = get_supabase()
    
    supabase.table("equipment").delete().eq("id", equipment_id).execute()
    return None
```

**app/routers/maintenance.py**
```python
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from datetime import datetime
from app.models.maintenance import (
    MaintenanceTaskCreate, 
    MaintenanceTaskUpdate, 
    MaintenanceTaskResponse
)
from app.models.user import UserRole
from app.database import get_supabase
from app.middleware.auth_middleware import get_current_user, require_role

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.get("", response_model=List[MaintenanceTaskResponse])
async def get_all_tasks(
    status_filter: str = None,
    assigned_to: str = None,
    current_user = Depends(get_current_user)
):
    """Get all maintenance tasks with filters"""
    supabase = get_supabase()
    
    query = supabase.table("maintenance_tasks").select("*")
    
    if status_filter:
        query = query.eq("status", status_filter)
    
    if assigned_to:
        query = query.eq("assigned_to", assigned_to)
    
    result = query.order("due_date").execute()
    return result.data

@router.get("/{task_id}", response_model=MaintenanceTaskResponse)
async def get_task(
    task_id: str,
    current_user = Depends(get_current_user)
):
    """Get specific maintenance task"""
    supabase = get_supabase()
    
    result = supabase.table("maintenance_tasks")\
        .select("*")\
        .eq("id", task_id)\
        .single()\
        .execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return result.data

@router.post("", response_model=MaintenanceTaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task: MaintenanceTaskCreate,
    current_user = Depends(require_role([UserRole.ADMIN, UserRole.MANAGER]))
):
    """Create maintenance task (Manager/Admin only)"""
    supabase = get_supabase()
    
    task_data = task.model_dump()
    task_data["created_by"] = current_user.id
    
    result = supabase.table("maintenance_tasks").insert(task_data).execute()
    
    # Log the action
    supabase.table("maintenance_logs").insert({
        "task_id": result.data[0]["id"],
        "equipment_id": task.equipment_id,
        "performed_by": current_user.id,
        "action": "created",
        "notes": f"Task created: {task.title}"
    }).execute()
    
    return result.data[0]

@router.put("/{task_id}", response_model=MaintenanceTaskResponse)
async def update_task(
    task_id: str,
    task: MaintenanceTaskUpdate,
    current_user = Depends(get_current_user)
):
    """Update maintenance task"""
    supabase = get_supabase()
    
    # Check if user has permission
    existing_task = supabase.table("maintenance_tasks")\
        .select("*")\
        .eq("id", task_id)\
        .single()\
        .execute()
    
    if not existing_task.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    update_data = task.model_dump(exclude_unset=True)
    
    # If completing the task, set completed_date
    if update_data.get("status") == "completed" and not update_data.get("completed_date"):
        update_data["completed_date"] = datetime.now()
    
    result = supabase.table("maintenance_tasks")\
        .update(update_data)\
        .eq("id", task_id)\
        .execute()
    
    # Log the action
    action = "updated"
    if update_data.get("status") == "completed":
        action = "completed"
    
    supabase.table("maintenance_logs").insert({
        "task_id": task_id,
        "equipment_id": existing_task.data["equipment_id"],
        "performed_by": current_user.id,
        "action": action,
        "notes": task.notes or f"Task {action}"
    }).execute()
    
    return result.data[0]
```

**app/routers/dashboard.py**
```python
from fastapi import APIRouter, Depends
from app.database import get_supabase
from app.middleware.auth_middleware import get_current_user
from datetime import date, timedelta

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats(current_user = Depends(get_current_user)):
    """Get dashboard statistics"""
    supabase = get_supabase()
    
    # Equipment statistics
    equipment = supabase.table("equipment").select("status").execute()
    equipment_stats = {
        "total": len(equipment.data),
        "operational": len([e for e in equipment.data if e["status"] == "operational"]),
        "under_maintenance": len([e for e in equipment.data if e["status"] == "under_maintenance"]),
        "retired": len([e for e in equipment.data if e["status"] == "retired"])
    }
    
    # Maintenance statistics
    tasks = supabase.table("maintenance_tasks").select("status, priority, due_date").execute()
    
    today = date.today()
    overdue = [t for t in tasks.data 
               if t["status"] != "completed" and 
               date.fromisoformat(t["due_date"]) < today]
    
    upcoming = [t for t in tasks.data 
                if t["status"] != "completed" and 
                date.fromisoformat(t["due_date"]) <= today + timedelta(days=7)]
    
    maintenance_stats = {
        "total_tasks": len(tasks.data),
        "pending": len([t for t in tasks.data if t["status"] == "pending"]),
        "in_progress": len([t for t in tasks.data if t["status"] == "in_progress"]),
        "completed": len([t for t in tasks.data if t["status"] == "completed"]),
        "overdue": len(overdue),
        "upcoming_week": len(upcoming),
        "high_priority": len([t for t in tasks.data if t["priority"] == "high"])
    }
    
    return {
        "equipment": equipment_stats,
        "maintenance": maintenance_stats
    }

@router.get("/recent-activity")
async def get_recent_activity(
    limit: int = 10,
    current_user = Depends(get_current_user)
):
    """Get recent maintenance activity"""
    supabase = get_supabase()
    
    logs = supabase.table("maintenance_logs")\
        .select("*, profiles(full_name), equipment(name)")\
        .order("created_at", desc=True)\
        .limit(limit)\
        .execute()
    
    return logs.data
```

**app/routers/team.py**
```python
from fastapi import APIRouter, Depends
from typing import List
from app.models.user import UserResponse
from app.database import get_supabase
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/team", tags=["Team"])

@router.get("/members", response_model=List[UserResponse])
async def get_team_members(current_user = Depends(get_current_user)):
    """Get all team members"""
    supabase = get_supabase()
    
    result = supabase.table("profiles").select("*").execute()
    return result.data

@router.get("/technicians", response_model=List[UserResponse])
async def get_technicians(current_user = Depends(get_current_user)):
    """Get all technicians for task assignment"""
    supabase = get_supabase()
    
    result = supabase.table("profiles")\
        .select("*")\
        .eq("role", "technician")\
        .execute()
    
    return result.data
```

#### **Step 6: Main Application (10 min)**

**app/main.py**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import auth, equipment, maintenance, dashboard, team

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(equipment.router, prefix=settings.API_V1_PREFIX)
app.include_router(maintenance.router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_V1_PREFIX)
app.include_router(team.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
async def root():
    return {
        "message": "GearGuard API",
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_PREFIX}/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

---

## ⏱️ 5-Hour Implementation Timeline

### **Hour 1: Setup & Database (60 min)**
- ✅ Create Supabase project (10 min)
- ✅ Set up database tables with SQL schema (20 min)
- ✅ Configure Row Level Security policies (15 min)
- ✅ Install Python dependencies (5 min)
- ✅ Configure environment variables (10 min)

### **Hour 2: Core Backend (60 min)**
- ✅ Implement Pydantic models (15 min)
- ✅ Create authentication endpoints (20 min)
- ✅ Build equipment CRUD endpoints (25 min)

### **Hour 2.5: Maintenance & Dashboard (30 min)**
- ✅ Implement maintenance task endpoints (20 min)
- ✅ Create dashboard statistics endpoint (10 min)

### **Hour 3-5: Frontend Development (120 min)**
- Frontend implementation (covered separately)

### **Hour 5.5: Testing & Integration (30 min)**
- ✅ Test all API endpoints (15 min)
- ✅ Frontend-backend integration (15 min)

---

## 🧪 Testing the Backend

### Using FastAPI Swagger UI
1. Start the server: `uvicorn app.main:app --reload`
2. Open: `http://localhost:8000/api/v1/docs`
3. Test endpoints interactively

### Quick Test Script (test_api.py)
```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Test signup
signup_data = {
    "email": "test@example.com",
    "password": "test123",
    "full_name": "Test User",
    "role": "technician"
}
response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
print("Signup:", response.json())

# Test login
login_data = {"email": "test@example.com", "password": "test123"}
response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
token = response.json()["access_token"]
print("Login successful")

# Test get equipment
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/equipment", headers=headers)
print("Equipment:", response.json())
```

---

## 📊 API Endpoints Summary

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/signup` | Register new user | No |
| POST | `/api/v1/auth/login` | User login | No |
| POST | `/api/v1/auth/logout` | User logout | Yes |

### Equipment
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/v1/equipment` | List all equipment | Yes | All |
| GET | `/api/v1/equipment/{id}` | Get equipment details | Yes | All |
| POST | `/api/v1/equipment` | Create equipment | Yes | Manager/Admin |
| PUT | `/api/v1/equipment/{id}` | Update equipment | Yes | Manager/Admin |
| DELETE | `/api/v1/equipment/{id}` | Delete equipment | Yes | Admin |

### Maintenance Tasks
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/v1/maintenance` | List all tasks | Yes | All |
| GET | `/api/v1/maintenance/{id}` | Get task details | Yes | All |
| POST | `/api/v1/maintenance` | Create task | Yes | Manager/Admin |
| PUT | `/api/v1/maintenance/{id}` | Update task | Yes | Assigned/Manager/Admin |

### Dashboard
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/dashboard/stats` | Get statistics | Yes |
| GET | `/api/v1/dashboard/recent-activity` | Recent activity | Yes |

### Team
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/team/members` | List all members | Yes |
| GET | `/api/v1/team/technicians` | List technicians | Yes |

---

## 🚀 Deployment (Bonus)

### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Render
1. Connect GitHub repository
2. Select "Web Service"
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Option 3: Vercel (Serverless)
```bash
pip install vercel
vercel --prod
```

---

## 🎯 Hackathon Success Tips

1. **Use Supabase Studio** for quick database inspection
2. **Enable RLS** from the start to avoid security issues
3. **Test with demo credentials** first
4. **Use FastAPI's auto-docs** for frontend team reference
5. **Keep error messages informative** for debugging
6. **Focus on MVP features** first, add extras if time permits

---

## 📝 Environment Setup Checklist

- [ ] Supabase project created
- [ ] Database tables created
- [ ] RLS policies configured
- [ ] Python 3.10+ installed
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] `.env` file configured
- [ ] Backend server running
- [ ] API documentation accessible
- [ ] Demo credentials tested

---

## 🆘 Common Issues & Solutions

### Issue: CORS errors
**Solution:** Add frontend URL to `ALLOWED_ORIGINS` in `config.py`

### Issue: Authentication fails
**Solution:** Check Supabase anon key and ensure RLS policies are correct

### Issue: Database connection error
**Solution:** Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `.env`

### Issue: Import errors
**Solution:** Ensure virtual environment is activated and dependencies installed

---

**Good luck with your hackathon! 🚀**

*Estimated Backend Development Time: 2.5 hours*
*Priority: Core features first, polish later*
