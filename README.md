# Yaal Nilam (யாழ் நிலம்) — Jaffna Property Market

AI-powered real estate platform for the Jaffna Peninsula, Sri Lanka.
Bilingual Tamil/English support with WhatsApp voice/text AI bot and web portal.

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Yaal Nilam Platform                │
├──────────────┬───────────────┬────────────────────────┤
│  Next.js Web │  Node Gateway │  Python AI Service     │
│  :3000       │  :3001        │  :8000                 │
│  React +     │  WhatsApp     │  Whisper STT           │
│  Tailwind    │  webhooks     │  GPT-4o extraction     │
│  Leaflet map │  REST API     │  Matching engine       │
│  Auth/Dash   │  JWT auth     │  LangChain RAG         │
├──────────────┴───────────────┴────────────────────────┤
│  PostgreSQL/PostGIS :5432   │   Redis :6379           │
│  Geospatial queries         │   Session cache         │
└──────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local dev)
- Python 3.11+ (for local dev)
- OpenAI API key (optional — mock mode works without it)

### 1. Clone & Configure

```bash
cp .env.example .env
# Edit .env with your API keys (or leave defaults for mock mode)
```

### 2. Start with Docker Compose

```bash
docker compose up --build
```

This starts all five services:

| Service       | URL                        | Purpose                              |
|---------------|----------------------------|--------------------------------------|
| **web**       | http://localhost:3000       | Next.js property portal              |
| **gateway**   | http://localhost:3001       | Node.js API + WhatsApp webhooks      |
| **ai-service**| http://localhost:8000       | Python AI (Whisper, GPT-4o, matcher) |
| **postgres**  | localhost:5432              | PostgreSQL/PostGIS database           |
| **redis**     | localhost:6379              | Session cache                        |

### 3. Local Development (without Docker)

**Database:**
```bash
# Start PostgreSQL with PostGIS
docker compose up postgres redis -d

# Seed the database
psql -h localhost -U postgres -d yaalnilam -f database/init.sql
psql -h localhost -U postgres -d yaalnilam -f database/seed-jaffna.sql
```

**Gateway (Node.js):**
```bash
cd gateway
npm install
npm run dev          # Starts on :3001
```

**AI Service (Python):**
```bash
cd ai-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Web Portal (Next.js):**
```bash
cd web
npm install
npm run dev          # Starts on :3000
```

## Project Structure

```
JAFFNA-PROPERTY/
├── web/                        # Next.js web portal
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── properties/     # Properties listing + detail
│   │   │   ├── map/            # Leaflet map search
│   │   │   ├── agents/         # Agent profiles
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── add-listing/    # Create listing form
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Registration page
│   │   ├── components/         # Shared React components
│   │   └── lib/                # API client, store, translations
│   ├── tailwind.config.ts
│   └── package.json
│
├── gateway/                    # Node.js Express gateway
│   └── src/
│       ├── routes/
│       │   ├── whatsapp.js     # WhatsApp webhook handler
│       │   └── api.js          # REST API for web portal
│       ├── services/
│       │   ├── whatsapp-api.js # Meta Cloud API client
│       │   ├── media.js        # Audio/image processing
│       │   ├── ai-bridge.js    # Bridge to Python AI service
│       │   ├── session.js      # Redis session management
│       │   ├── messages.js     # Message audit trail
│       │   └── users.js        # User management
│       ├── config/             # Database + Redis config
│       └── middleware/         # JWT auth middleware
│
├── ai-service/                 # Python FastAPI AI service
│   └── app/
│       ├── routes/
│       │   ├── message_routes.py   # Text message processing
│       │   ├── voice_routes.py     # Voice note processing
│       │   └── matching_routes.py  # Property matching API
│       └── services/
│           ├── whisper_stt.py          # OpenAI Whisper STT
│           ├── intent_extractor.py     # GPT-4o intent extraction
│           ├── conversation_manager.py # Multi-turn flow orchestration
│           ├── property_db.py          # Database operations
│           └── matcher.py              # Weighted matching algorithm
│
├── database/
│   ├── init.sql                # Full schema (PostGIS, enums, tables, functions)
│   └── seed-jaffna.sql         # Jaffna divisions, GN divisions, places
│
├── docker-compose.yml          # Multi-service orchestration
├── .env.example                # Environment template
└── index.html                  # Standalone SPA (CDN React preview)
```

## Key Features

### Web Portal
- Property listing with filters (type, intent, price, bedrooms, area)
- Interactive Leaflet map of Jaffna Peninsula
- Agent profiles with verification badges
- User dashboard with listing management and match alerts
- Bilingual Tamil/English interface with one-click toggle
- Mobile responsive design

### WhatsApp AI Bot
- Voice note processing (Tamil, English, Tanglish)
- Multi-turn conversation flow with follow-up questions
- Structured intent extraction from messy natural language
- Sri Lankan currency normalization (Lakhs/Crores/Kodi → LKR)
- Land unit normalization (Parappu → Perches)
- 40+ Jaffna location name mappings (English + Tamil + abbreviations)

### Matching Engine
- Weighted scoring: Distance 30%, Budget 30%, Bedrooms 20%, Bathrooms 20%
- Haversine distance calculation with configurable radius
- ±25% budget tolerance with linear decay
- ±2 room tolerance scoring
- Minimum 40% threshold for match alerts
- Location name boosting (+15 points)

## Mock Mode

All services run in mock mode without API keys. The system returns realistic sample data for development and testing. Set `OPENAI_API_KEY` in `.env` to enable real AI processing.

## Tech Stack

| Layer        | Technology                                    |
|--------------|-----------------------------------------------|
| Frontend     | Next.js 14, React 18, Tailwind CSS, Leaflet   |
| Gateway      | Node.js 20, Express, JWT, Redis               |
| AI Service   | Python 3.11, FastAPI, OpenAI (Whisper + GPT-4o)|
| Database     | PostgreSQL 16, PostGIS 3.4                     |
| Cache        | Redis 7                                       |
| Messaging    | WhatsApp Business Cloud API                   |
| Container    | Docker, Docker Compose                        |

## Environment Variables

See `.env.example` for the complete list. Key variables:

| Variable              | Required | Description                    |
|-----------------------|----------|--------------------------------|
| `OPENAI_API_KEY`      | No       | Enables real AI (mock without) |
| `WHATSAPP_TOKEN`      | No       | Meta Cloud API token           |
| `WHATSAPP_PHONE_ID`   | No       | WhatsApp Business phone ID     |
| `DATABASE_URL`        | Yes      | PostgreSQL connection string   |
| `REDIS_URL`           | No       | Redis connection (fallback ok) |
| `JWT_SECRET`          | Yes      | Secret for JWT signing         |

## License

Private — All rights reserved.
