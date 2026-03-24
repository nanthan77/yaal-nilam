"""
YAAL NILAM — Python AI Microservice
FastAPI application for:
1. OpenAI Whisper STT (Tamil/English/Tanglish voice notes)
2. GPT-4o intent extraction with structured JSON output
3. Property matching algorithm (weighted scoring)
4. LangChain RAG for contextual responses
5. Auto-matchmaker alert triggers
6. ElevenLabs TTS (Tamil/English voice responses)
"""

import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routes import message_routes, voice_routes, matching_routes, tts_routes

app = FastAPI(
    title="Yaal Nilam AI Service",
    description="AI-powered property matching engine for Jaffna real estate",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules
app.include_router(message_routes.router, prefix="/api")
app.include_router(voice_routes.router, prefix="/api")
app.include_router(matching_routes.router, prefix="/api")
app.include_router(tts_routes.router, prefix="/api")


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "yaalnilam-ai",
        "version": "1.0.0",
        "models": {
            "stt": os.getenv("WHISPER_MODEL", "whisper-1"),
            "llm": os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        }
    }
