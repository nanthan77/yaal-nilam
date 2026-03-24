"""
ElevenLabs Text-to-Speech Service for Yaal Nilam

Converts AI responses to natural-sounding Tamil/English voice audio.
Uses ElevenLabs API for high-quality TTS, with browser SpeechSynthesis fallback.

Tamil voices:   ElevenLabs multilingual v2 model supports Tamil
English voices: Standard ElevenLabs voices

Mock mode: Returns a silent audio stub when no API key is configured.
"""

import os
import io
import uuid
import struct
import httpx
from typing import Optional

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"

# ── Voice Configuration ────────────────────────────────────────
# These can be customized per language. Use ElevenLabs voice library
# to find voice IDs that sound natural for Tamil and English.

VOICE_CONFIG = {
    "ta": {
        "voice_id": os.getenv("ELEVENLABS_TAMIL_VOICE_ID", "pNInz6obpgDQGcFmaJgB"),  # Adam (multilingual)
        "model_id": "eleven_multilingual_v2",  # Required for Tamil
        "stability": 0.5,
        "similarity_boost": 0.8,
        "style": 0.4,
        "use_speaker_boost": True,
    },
    "en": {
        "voice_id": os.getenv("ELEVENLABS_ENGLISH_VOICE_ID", "21m00Tcm4TlvDq8ikWAM"),  # Rachel
        "model_id": "eleven_multilingual_v2",
        "stability": 0.5,
        "similarity_boost": 0.75,
        "style": 0.3,
        "use_speaker_boost": True,
    },
}

# ── Supported output formats ───────────────────────────────────
# ElevenLabs supports: mp3_44100_128, mp3_22050_32, pcm_16000, ulaw_8000
OUTPUT_FORMAT = os.getenv("ELEVENLABS_OUTPUT_FORMAT", "mp3_44100_128")

# Directory for caching generated audio files
AUDIO_CACHE_DIR = os.getenv("TTS_CACHE_DIR", "/tmp/yaalnilam-tts")


def _ensure_cache_dir():
    os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)


def _generate_silent_wav(duration_ms: int = 1000) -> bytes:
    """Generate a silent WAV file as mock audio output."""
    sample_rate = 16000
    num_samples = int(sample_rate * duration_ms / 1000)
    data_size = num_samples * 2  # 16-bit = 2 bytes per sample

    wav = io.BytesIO()
    # WAV header
    wav.write(b"RIFF")
    wav.write(struct.pack("<I", 36 + data_size))
    wav.write(b"WAVE")
    wav.write(b"fmt ")
    wav.write(struct.pack("<I", 16))        # chunk size
    wav.write(struct.pack("<H", 1))         # PCM
    wav.write(struct.pack("<H", 1))         # mono
    wav.write(struct.pack("<I", sample_rate))
    wav.write(struct.pack("<I", sample_rate * 2))
    wav.write(struct.pack("<H", 2))         # block align
    wav.write(struct.pack("<H", 16))        # bits per sample
    wav.write(b"data")
    wav.write(struct.pack("<I", data_size))
    wav.write(b"\x00" * data_size)          # silence

    return wav.getvalue()


async def text_to_speech(
    text: str,
    language: str = "en",
    output_format: str = OUTPUT_FORMAT,
) -> dict:
    """
    Convert text to speech using ElevenLabs API.

    Args:
        text: The text to convert to speech
        language: "en" or "ta" (Tamil)
        output_format: Audio format (mp3_44100_128, pcm_16000, etc.)

    Returns:
        dict with:
            - audio_bytes: Raw audio bytes
            - content_type: MIME type (audio/mpeg for mp3)
            - file_path: Path to cached file (if saved)
            - source: "elevenlabs" or "mock"
    """
    lang_key = "ta" if language in ("ta", "tamil", "ta-IN") else "en"
    config = VOICE_CONFIG[lang_key]

    # ── Real ElevenLabs API ────────────────────────────
    if ELEVENLABS_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{ELEVENLABS_BASE_URL}/text-to-speech/{config['voice_id']}",
                    headers={
                        "xi-api-key": ELEVENLABS_API_KEY,
                        "Content-Type": "application/json",
                        "Accept": "audio/mpeg",
                    },
                    json={
                        "text": text,
                        "model_id": config["model_id"],
                        "voice_settings": {
                            "stability": config["stability"],
                            "similarity_boost": config["similarity_boost"],
                            "style": config.get("style", 0),
                            "use_speaker_boost": config.get("use_speaker_boost", True),
                        },
                    },
                    params={"output_format": output_format},
                )

                if response.status_code == 200:
                    audio_bytes = response.content

                    # Cache to file
                    _ensure_cache_dir()
                    file_id = str(uuid.uuid4())[:8]
                    ext = "mp3" if "mp3" in output_format else "wav"
                    file_path = os.path.join(AUDIO_CACHE_DIR, f"tts_{file_id}.{ext}")

                    with open(file_path, "wb") as f:
                        f.write(audio_bytes)

                    return {
                        "audio_bytes": audio_bytes,
                        "content_type": "audio/mpeg" if "mp3" in output_format else "audio/wav",
                        "file_path": file_path,
                        "source": "elevenlabs",
                        "voice_id": config["voice_id"],
                        "model_id": config["model_id"],
                        "language": lang_key,
                        "characters": len(text),
                    }
                else:
                    print(f"ElevenLabs API error {response.status_code}: {response.text[:200]}")

        except Exception as e:
            print(f"ElevenLabs TTS error: {e}")

    # ── Mock fallback ──────────────────────────────────
    print(f"[MOCK TTS] Generating silent audio for: {text[:80]}...")
    audio_bytes = _generate_silent_wav(duration_ms=max(len(text) * 50, 1000))

    return {
        "audio_bytes": audio_bytes,
        "content_type": "audio/wav",
        "file_path": None,
        "source": "mock",
        "voice_id": "mock",
        "model_id": "mock",
        "language": lang_key,
        "characters": len(text),
    }


async def text_to_speech_stream(
    text: str,
    language: str = "en",
):
    """
    Stream TTS audio chunks for real-time playback.
    Uses ElevenLabs streaming endpoint for low-latency audio.

    Yields audio chunks as bytes.
    """
    lang_key = "ta" if language in ("ta", "tamil", "ta-IN") else "en"
    config = VOICE_CONFIG[lang_key]

    if ELEVENLABS_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream(
                    "POST",
                    f"{ELEVENLABS_BASE_URL}/text-to-speech/{config['voice_id']}/stream",
                    headers={
                        "xi-api-key": ELEVENLABS_API_KEY,
                        "Content-Type": "application/json",
                    },
                    json={
                        "text": text,
                        "model_id": config["model_id"],
                        "voice_settings": {
                            "stability": config["stability"],
                            "similarity_boost": config["similarity_boost"],
                        },
                    },
                    params={"output_format": "mp3_44100_128"},
                ) as response:
                    if response.status_code == 200:
                        async for chunk in response.aiter_bytes(chunk_size=4096):
                            yield chunk
                        return
        except Exception as e:
            print(f"ElevenLabs streaming error: {e}")

    # Mock: yield silent audio in one chunk
    yield _generate_silent_wav(duration_ms=max(len(text) * 50, 1000))


async def get_available_voices() -> list:
    """
    Fetch available voices from ElevenLabs account.
    Useful for admin panel voice selection.
    """
    if not ELEVENLABS_API_KEY:
        return [
            {"voice_id": "mock-tamil", "name": "Tamil Voice (Mock)", "language": "ta"},
            {"voice_id": "mock-english", "name": "English Voice (Mock)", "language": "en"},
        ]

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{ELEVENLABS_BASE_URL}/voices",
                headers={"xi-api-key": ELEVENLABS_API_KEY},
            )
            if response.status_code == 200:
                data = response.json()
                return [
                    {
                        "voice_id": v["voice_id"],
                        "name": v["name"],
                        "category": v.get("category", ""),
                        "labels": v.get("labels", {}),
                    }
                    for v in data.get("voices", [])
                ]
    except Exception as e:
        print(f"Get voices error: {e}")

    return []


async def get_usage_stats() -> dict:
    """Get current ElevenLabs usage/quota stats."""
    if not ELEVENLABS_API_KEY:
        return {"source": "mock", "characters_used": 0, "character_limit": 0}

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{ELEVENLABS_BASE_URL}/user/subscription",
                headers={"xi-api-key": ELEVENLABS_API_KEY},
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "source": "elevenlabs",
                    "tier": data.get("tier", "free"),
                    "characters_used": data.get("character_count", 0),
                    "character_limit": data.get("character_limit", 0),
                    "next_reset": data.get("next_character_count_reset_unix"),
                }
    except Exception as e:
        print(f"Usage stats error: {e}")

    return {"source": "error"}
