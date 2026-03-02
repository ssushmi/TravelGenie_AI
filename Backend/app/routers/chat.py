from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.chat_service import chat
import uuid

router = APIRouter()


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a message to the travel chatbot."""
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    
    if len(request.message) > 2000:
        raise HTTPException(status_code=400, detail="Message too long (max 2000 characters).")
    
    try:
        reply = await chat(
            session_id=request.session_id,
            user_message=request.message,
            place_context=request.place_context,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
    
    return ChatResponse(reply=reply, session_id=request.session_id)


@router.get("/session/new")
async def new_session():
    """Generate a new session ID."""
    return {"session_id": str(uuid.uuid4())}
