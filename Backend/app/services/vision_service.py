import anthropic
import base64
import json
import re
from typing import Optional
from app.models.schemas import LocationInfo

client = anthropic.Anthropic()

VISION_PROMPT = """You are an expert travel guide and geographer with encyclopedic knowledge of world landmarks.

Analyze this image and identify the travel destination or landmark shown.

Respond ONLY with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "place_name": "Name of the specific landmark or destination",
  "country": "Country name",
  "latitude": 0.0,
  "longitude": 0.0,
  "overview": "2-3 sentence overview of this place",
  "history": "2-3 sentences about the history",
  "best_time_to_visit": "1-2 sentences about best time to visit",
  "fun_facts": ["fact 1", "fact 2", "fact 3"],
  "weather_overview": "Brief climate description",
  "image_confidence": 0.95
}

If you cannot identify a specific travel destination, set place_name to "Unknown Location" and confidence to 0.1.
Be specific - if you see the Eiffel Tower, say "Eiffel Tower, Paris" not just "Paris".
"""

async def analyze_image(image_bytes: bytes, content_type: str) -> LocationInfo:
    """Use Claude Vision to identify the travel destination in an image."""
    
    # Encode image to base64
    image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")
    
    # Map content types
    media_type_map = {
        "image/jpeg": "image/jpeg",
        "image/jpg": "image/jpeg",
        "image/png": "image/png",
        "image/gif": "image/gif",
        "image/webp": "image/webp",
    }
    media_type = media_type_map.get(content_type.lower(), "image/jpeg")
    
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1500,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": VISION_PROMPT
                    }
                ],
            }
        ],
    )
    
    raw = response.content[0].text.strip()
    
    # Strip markdown code fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    
    data = json.loads(raw)
    
    return LocationInfo(**data)
