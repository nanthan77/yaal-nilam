"""
Text-to-Speech Routes — ElevenLabs TTS API endpoints

Endpoints:
  POST /api/tts/speak       → Convert text to audio (returns audio file)
  POST /api/tts/stream      → Stream audio chunks (low-latency)
  GET  /api/tts/voices      → List available voices
  GET  /api/tts/usage       → ElevenLabs quota usage
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import Optional
from app.services.elevenlabs_tts import (
    text_to_speech,
    text_to_speech_stream,
    get_available_voices,
    get_usage_stats,
)

router = APIRouter()


class TTSRequest(BaseModel):
    text: str
    language: str = "en"           # "en" or "ta"
    output_format: str = "mp3_44100_128"
    voice_id: Optional[str] = None  # Override default voice


@router.post("/tts/speak")
async def speak(request: TTSRequest):
    """
    Convert text to speech and return audio file.
    Supports Tamil and English via ElevenLabs multilingual v2.
    Falls back to silent mock audio when no API key is configured.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")

    if len(request.text) > 5000:
        raise HTTPException(status_code=400, detail="Text exceeds 5000 character limit")

    result = await text_to_speech(
        text=request.text,
        language=request.language,
        output_format=request.output_format,
    )

    return Response(
        content=result["audio_bytes"],
        media_type=result["content_type"],
        headers={
            "X-TTS-Source": result["source"],
            "X-TTS-Language": result["language"],
            "X-TTS-Characters": str(result["characters"]),
        },
    )


@router.post("/tts/stream")
async def stream_speech(request: TTSRequest):
    """
    Stream TTS audio for real-time playback.
    Lower latency than /speak — starts playing before full generation.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")

    return StreamingResponse(
        text_to_speech_stream(text=request.text, language=request.language),
        media_type="audio/mpeg",
        headers={
            "Transfer-Encoding": "chunked",
            "X-TTS-Language": request.language,
        },
    )


@router.get("/tts/voices")
async def list_voices():
    """
    List available ElevenLabs voices.
    Returns mock voices when no API key is configured.
    """
    voices = await get_available_voices()
    return {"voices": voices, "total": len(voices)}


@router.get("/tts/usage")
async def usage():
    """
    Get ElevenLabs character usage and quota.
    Useful for monitoring costs in admin dashboard.
    """
    stats = await get_usage_stats()
    return stats
