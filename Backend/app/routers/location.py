from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.distance import calculate_travel_info
from app.models.schemas import DistanceResult

router = APIRouter()


class DistanceRequest(BaseModel):
    user_lat: float
    user_lon: float
    dest_lat: float
    dest_lon: float


@router.post("/distance", response_model=DistanceResult)
async def get_distance(request: DistanceRequest):
    """Calculate distance and travel info between two coordinates."""
    try:
        result = calculate_travel_info(
            request.user_lat, request.user_lon,
            request.dest_lat, request.dest_lon
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
