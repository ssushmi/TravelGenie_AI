import anthropic
from typing import Dict, List
from datetime import datetime, timedelta

client = anthropic.Anthropic()

# In-memory session store: {session_id: {"messages": [...], "last_active": datetime, "context": str}}
sessions: Dict[str, dict] = {}

SESSION_TTL_MINUTES = 60
MAX_HISTORY = 20  # Max messages to keep per session

SYSTEM_PROMPT_TEMPLATE = """You are an expert travel guide AI assistant specializing in destination knowledge, travel planning, and cultural insights.

{context_section}

Guidelines:
- Answer travel-related questions with enthusiasm and expertise
- Provide practical, actionable travel advice
- Include cultural sensitivity and local tips when relevant
- If asked about something completely unrelated to travel, politely redirect: "I'm your travel guide, so I'm best equipped to help with travel questions! Is there anything about {place_name} or travel planning I can help with?"
- Keep responses concise but informative (2-4 paragraphs max)
- Use a warm, knowledgeable tone like a seasoned travel guide
"""

def _cleanup_old_sessions():
    """Remove sessions older than TTL."""
    now = datetime.utcnow()
    expired = [
        sid for sid, data in sessions.items()
        if now - data["last_active"] > timedelta(minutes=SESSION_TTL_MINUTES)
    ]
    for sid in expired:
        del sessions[sid]


def get_or_create_session(session_id: str, place_context: str = None) -> dict:
    _cleanup_old_sessions()
    
    if session_id not in sessions:
        sessions[session_id] = {
            "messages": [],
            "last_active": datetime.utcnow(),
            "context": place_context or "",
            "place_name": place_context or "your destination"
        }
    else:
        sessions[session_id]["last_active"] = datetime.utcnow()
        if place_context:
            sessions[session_id]["context"] = place_context
            sessions[session_id]["place_name"] = place_context
    
    return sessions[session_id]


def build_system_prompt(session: dict) -> str:
    context = session.get("context", "")
    place_name = session.get("place_name", "the destination")
    
    if context:
        context_section = f"Current destination context: The user is inquiring about {context}. Use this as your primary knowledge base for answering questions."
    else:
        context_section = "No specific destination has been identified yet. Help the user upload an image or ask general travel questions."
    
    return SYSTEM_PROMPT_TEMPLATE.format(
        context_section=context_section,
        place_name=place_name
    )


async def chat(session_id: str, user_message: str, place_context: str = None) -> str:
    session = get_or_create_session(session_id, place_context)
    
    # Add user message to history
    session["messages"].append({"role": "user", "content": user_message})
    
    # Trim history if too long
    if len(session["messages"]) > MAX_HISTORY:
        session["messages"] = session["messages"][-MAX_HISTORY:]
    
    system_prompt = build_system_prompt(session)
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        system=system_prompt,
        messages=session["messages"],
    )
    
    assistant_reply = response.content[0].text
    
    # Add assistant response to history
    session["messages"].append({"role": "assistant", "content": assistant_reply})
    
    return assistant_reply
