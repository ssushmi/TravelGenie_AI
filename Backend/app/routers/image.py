from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.services.vision_service import analyze_image
from app.utils.distance import calculate_travel_info
from app.models.schemas import AnalysisResponse

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_travel_image(
    file: UploadFile = File(...),
    user_lat: Optional[float] = Form(None),
    user_lon: Optional[float] = Form(None),
):
    """
    Analyze an uploaded image to identify a travel destination.
    Optionally provide user coordinates for distance calculation.
    """
    # Validate content type
    content_type = file.content_type or "image/jpeg"
    if content_type.lower() not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type: {content_type}. Allowed: JPEG, PNG, WebP, GIF"
        )
    
    # Read and validate file size
    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
    
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    
    # Analyze the image
    try:
        location_info = await analyze_image(image_bytes, content_type)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Could not parse location data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")
    
    # Calculate distance if user coordinates provided
    distance_result = None
    if user_lat is not None and user_lon is not None:
        try:
            distance_result = calculate_travel_info(
                user_lat, user_lon,
                location_info.latitude, location_info.longitude
            )
        except Exception as e:
            # Distance calculation is non-critical, log and continue
            print(f"Distance calculation error: {e}")
    
    return AnalysisResponse(location=location_info, distance=distance_result)
