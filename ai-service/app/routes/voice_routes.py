"""
Voice Processing Routes
Handles: .ogg/.mp3 voice notes → Whisper STT → Intent Extraction
"""

import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Form
from app.services.whisper_stt import transcribe_audio
from app.services.intent_extractor import extract_intent
from app.services.conversation_manager import process_with_context

router = APIRouter()


@router.post("/process-voice")
async def process_voice(
    audio: UploadFile = File(...),
    phone: str = Form(...),
    session: str = Form("{}")
):
    """
    Process a WhatsApp voice note:
    1. Save uploaded audio temporarily
    2. Transcribe via OpenAI Whisper (handles Tamil, English, Tanglish)
    3. Extract intent from transcription
    4. Return structured response
    """
    import json
    session_data = json.loads(session)

    # Save audio to temp file
    suffix = ".mp3" if audio.filename.endswith(".mp3") else ".ogg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Step 1: Transcribe with Whisper
        transcription = await transcribe_audio(tmp_path)
        print(f"🎤 Transcription for {phone}: {transcription}")

        if not transcription or transcription.strip() == "":
            return {
                "reply": "Sorry, I couldn't understand the voice note. Could you try again or type your message? / மன்னிக்கவும், குரல் செய்தி புரியவில்லை. மீண்டும் முயற்சிக்கவும்.",
                "intent": "transcription_failed",
                "confidence": 0,
                "transcription": ""
            }

        # Step 2: Extract intent from transcribed text
        result = await process_with_context(
            phone=phone,
            text=transcription,
            session=session_data,
            source="voice"
        )

        result["transcription"] = transcription
        return result

    finally:
        # Clean up temp file
        try:
            os.unlink(tmp_path)
        except Exception:
            pass
