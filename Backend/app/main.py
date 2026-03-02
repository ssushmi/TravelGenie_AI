from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import image, chat, location
import uvicorn

app = FastAPI(
    title="Travel Insight API",
    description="AI-powered travel destination analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(image.router, prefix="/api/image", tags=["Image Analysis"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chatbot"])
app.include_router(location.router, prefix="/api/location", tags=["Location"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Travel Insight API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
