# Yaal Nilam — AI-Powered Real Estate Portal: Architecture Specification

## System Paradigm
Hybrid microservices architecture deploying:
- **Node.js API Gateway** — async webhook routing, WhatsApp BSP, JWT auth
- **Python AI Microservice** — FastAPI, LangChain, Whisper STT, LLM intent extraction
- **Next.js Web Portal** — property browsing, agent profiles, user dashboards
- **PostgreSQL** — geospatial property data with Jaffna GN division mapping

## Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                      YAAL NILAM PLATFORM                     │
├──────────────┬──────────────────┬───────────────────────────┤
│  Next.js     │  Node.js Gateway │  Python AI Microservice   │
│  Web Portal  │  (Express/NestJS)│  (FastAPI)                │
│              │                  │                           │
│  - Property  │  - WhatsApp      │  - Whisper STT            │
│    Browsing  │    Webhooks      │  - GPT-4o Intent          │
│  - Agent     │  - JWT Auth      │    Extraction             │
│    Profiles  │  - Session Mgmt  │  - LangChain RAG          │
│  - User      │  - Media Download│  - Property Matching      │
│    Dashboard │  - Template Msgs │    Algorithm              │
│  - Tamil/EN  │  - Redis Sessions│  - ChromaDB Vectors       │
│    Bilingual │                  │                           │
├──────────────┴──────────────────┴───────────────────────────┤
│                     PostgreSQL + Redis                        │
│  - Users, Listings, Requirements tables                      │
│  - Jaffna geospatial hierarchy (DS → GN divisions)          │
│  - Haversine distance calculations                           │
│  - Session grouping for multi-image messages                 │
├─────────────────────────────────────────────────────────────┤
│                     Cloud Storage (S3)                        │
│  - Property images, voice note archives                      │
└─────────────────────────────────────────────────────────────┘
```

## STT Provider: OpenAI Whisper
- Cost: ~$0.006/minute
- Handles Tamil, English, and Tanglish code-switching
- Requires ffmpeg for .ogg → .mp3 conversion

## WhatsApp Business API
- Provider: Meta Cloud API (Direct) or Twilio
- 24-hour rule: Free-form replies within window; Template Messages for alerts
- Per-message pricing effective July 2025

## Property Matching: Weighted Scoring
| Factor    | Weight | Tolerance |
|-----------|--------|-----------|
| Distance  | 30%    | 10km radius (Haversine) |
| Budget    | 30%    | ±25% flexibility |
| Bedrooms  | 20%    | ±2 rooms |
| Bathrooms | 20%    | ±2 rooms |
- Minimum Match Score: 40% to qualify for alerts
