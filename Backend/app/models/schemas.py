from pydantic import BaseModel
from typing import Optional, List

class LocationInfo(BaseModel):
    place_name: str
    country: str
    latitude: float
    longitude: float
    overview: str
    history: str
    best_time_to_visit: str
    fun_facts: List[str]
    weather_overview: str
    image_confidence: float

class UserLocation(BaseModel):
    latitude: float
    longitude: float

class DistanceResult(BaseModel):
    distance_km: float
    distance_miles: float
    estimated_drive_hours: Optional[float]
    estimated_flight_hours: float
    approximate_flight_cost_usd: str
    approximate_budget_usd: str

class AnalysisResponse(BaseModel):
    location: LocationInfo
    distance: Optional[DistanceResult]

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    session_id: str
    place_context: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: str
