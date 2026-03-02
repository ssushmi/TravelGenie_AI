# 🌍 Travel Insight — AI-Powered Destination Explorer

Upload any travel photo and get instant AI-powered destination identification, rich cultural insights, distance calculations from your current location, and a context-aware travel chatbot.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 **AI Vision Analysis** | Claude Vision identifies landmarks, cities, and natural destinations |
| 📍 **Geolocation** | Browser geolocation for automatic current-location detection |
| 📏 **Distance Calculation** | Haversine formula — km, miles, flight/drive time |
| 💰 **Travel Cost Estimate** | Approximate flight cost and 7-day budget |
| 🤖 **AI Travel Chatbot** | Context-aware chatbot with session memory powered by Claude |
| 📚 **Rich Destination Info** | Overview, history, best time to visit, weather, fun facts |

---

## 🏗️ Architecture

```
travel-insight/
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── main.py          # App entry point & CORS
│   │   ├── routers/
│   │   │   ├── image.py     # POST /api/image/analyze
│   │   │   ├── chat.py      # POST /api/chat/message
│   │   │   └── location.py  # POST /api/location/distance
│   │   ├── services/
│   │   │   ├── vision_service.py   # Claude Vision image analysis
│   │   │   └── chat_service.py     # Claude chatbot with session memory
│   │   ├── models/
│   │   │   └── schemas.py   # Pydantic data models
│   │   └── utils/
│   │       └── distance.py  # Haversine formula implementation
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx          # Complete single-file React app
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Tailwind + custom styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── docker-compose.yml       # Full stack Docker setup
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

---

### Option 1: Manual Setup (Recommended for Development)

#### 1. Clone & configure environment

```bash
git clone <your-repo>
cd travel-insight
```

#### 2. Backend setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

**`backend/.env`:**
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

#### 3. Start the backend

```bash
# From the backend/ directory
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API will be available at: `http://localhost:8000`
Interactive docs: `http://localhost:8000/docs`

#### 4. Frontend setup

```bash
# In a new terminal, from the frontend/ directory
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# .env already has: VITE_API_URL=http://localhost:8000
```

#### 5. Start the frontend

```bash
npm run dev
```

App will be available at: `http://localhost:3000`

---

### Option 2: Docker Compose

```bash
# From project root
cp backend/.env.example backend/.env
# Edit backend/.env with your ANTHROPIC_API_KEY

# Build and start all services
docker-compose up --build

# Or in background
docker-compose up --build -d
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## 📡 API Reference

### `POST /api/image/analyze`
Analyze a travel destination image.

**Form data:**
- `file` (required): Image file (JPEG, PNG, WebP, GIF, max 10MB)
- `user_lat` (optional): User's latitude for distance calculation
- `user_lon` (optional): User's longitude for distance calculation

**Response:**
```json
{
  "location": {
    "place_name": "Eiffel Tower, Paris",
    "country": "France",
    "latitude": 48.8584,
    "longitude": 2.2945,
    "overview": "...",
    "history": "...",
    "best_time_to_visit": "...",
    "fun_facts": ["...", "..."],
    "weather_overview": "...",
    "image_confidence": 0.97
  },
  "distance": {
    "distance_km": 8423.5,
    "distance_miles": 5233.2,
    "estimated_flight_hours": 11.4,
    "estimated_drive_hours": null,
    "approximate_flight_cost_usd": "$400–$1,200",
    "approximate_budget_usd": "$2,000–$5,000"
  }
}
```

### `POST /api/chat/message`
Send a message to the travel chatbot.

**Body:**
```json
{
  "message": "What should I eat in Paris?",
  "session_id": "uuid-here",
  "place_context": "Eiffel Tower, Paris, France"
}
```

### `GET /api/chat/session/new`
Generate a new chat session ID.

### `POST /api/location/distance`
Calculate distance between two coordinates.

---

## 🤖 AI Logic

### Image Analysis
Uses **Claude claude-opus-4-6** vision model to:
1. Identify the specific landmark or destination
2. Extract name, country, and GPS coordinates
3. Generate overview, history, fun facts, and travel tips
4. Return confidence score (0-1)

### Haversine Formula
The distance calculation uses the spherical law of cosines:

```python
def haversine(lat1, lon1, lat2, lon2) -> float:
    R = 6371.0  # Earth radius in km
    φ1, φ2 = radians(lat1), radians(lat2)
    Δφ = radians(lat2 - lat1)
    Δλ = radians(lon2 - lon1)
    a = sin(Δφ/2)² + cos(φ1)·cos(φ2)·sin(Δλ/2)²
    return R · 2·atan2(√a, √(1−a))
```

### Chatbot
- Uses **Claude claude-sonnet-4-6** for fast, intelligent responses
- Maintains per-session conversation history (up to 20 messages)
- Injects detected destination as system context
- Politely redirects off-topic questions
- Sessions expire after 60 minutes of inactivity

---

## 🌐 Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Settings:
   - **Root directory:** `backend`
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variable: `ANTHROPIC_API_KEY`

### Frontend → Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. From the `frontend/` directory:
   ```bash
   vercel
   ```
3. Set environment variable in Vercel dashboard:
   - `VITE_API_URL` = your Render backend URL

---

## 🔧 Development Notes

- **Image size limit:** 10MB (enforced in backend)
- **Supported formats:** JPEG, PNG, WebP, GIF
- **Session memory:** In-memory (resets on server restart). For production, replace with Redis.
- **Rate limiting:** Not implemented — add with `slowapi` for production use.
- **CORS:** Currently allows all origins (`*`) — restrict to your frontend domain in production.

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| AI Vision | Anthropic Claude claude-opus-4-6 (Vision) |
| AI Chat | Anthropic Claude claude-sonnet-4-6 |
| Distance | Haversine formula (pure Python) |
| Deploy | Docker, Render, Vercel |
