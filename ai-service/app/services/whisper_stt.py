"""
OpenAI Whisper Speech-to-Text Service
Handles Tamil, English, and Tanglish voice notes from WhatsApp

Key considerations:
- WhatsApp voice notes arrive as .ogg (Opus codec)
- Gateway converts to .mp3 via ffmpeg before sending here
- Whisper handles: Sri Lankan Tamil, English, code-switching
- Cost: ~$0.006 per minute of audio
"""

import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "whisper-1")


async def transcribe_audio(file_path: str) -> str:
    """
    Transcribe an audio file using OpenAI Whisper API.

    Supports:
    - Tamil (தமிழ்)
    - English
    - Tanglish (Tamil typed/spoken in English: "Enaku Nallur la land venum")
    - Code-switching between Tamil and English

    Args:
        file_path: Path to the .mp3/.ogg audio file

    Returns:
        Transcribed text string
    """

    api_key = os.getenv("OPENAI_API_KEY")

    # MOCK MODE: Return sample transcription for development
    if not api_key or api_key == "your_openai_api_key":
        print("🔧 MOCK WHISPER — Returning sample transcription")
        return _mock_transcription()

    try:
        with open(file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model=WHISPER_MODEL,
                file=audio_file,
                language="ta",  # Hint: Tamil (helps accuracy)
                prompt=(
                    "This is a voice message about real estate property in Jaffna, Sri Lanka. "
                    "The speaker may use Tamil, English, or Tanglish (Tamil in English script). "
                    "Common terms: Lakhs, Perches, Parappu, Nallur, Kopay, Chunnakam, "
                    "Chavakachcheri, Point Pedro, Thirunelvely, Kokuvil, Manipay."
                ),
                response_format="text"
            )

        return response.strip()

    except Exception as e:
        print(f"Whisper STT error: {e}")
        return ""


def _mock_transcription() -> str:
    """Return a sample transcription for testing without API key"""
    import random
    samples = [
        "Enaku Nallur la 3 bedroom house venum, budget 300 lakhs",
        "I want to sell my land in Thirunelvely, 15 perches, asking 45 million",
        "நல்லூரில் வீடு வேண்டும், 4 அறைகள், 200 லட்சம் வரை",
        "Kopay area la rent ku house irukka? 50,000 per month budget",
        "I have a house for sale in Chunnakam, 10 perches, 2 floors",
    ]
    return random.choice(samples)
