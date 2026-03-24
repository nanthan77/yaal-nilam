"""
Text Message Processing Routes
Handles: text messages → Intent Extraction → DB operations → Response
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from app.services.conversation_manager import process_with_context

router = APIRouter()


class MessagePayload(BaseModel):
    type: str = "text"
    text: Optional[str] = None
    raw: Optional[str] = None
    attachedImages: Optional[List[str]] = None


class SessionData(BaseModel):
    current_flow: Optional[str] = "general"
    flow_state: Optional[Dict[str, Any]] = {}
    pending_fields: Optional[List[str]] = []
    media_buffer: Optional[List[str]] = []


class ProcessMessageRequest(BaseModel):
    phone: str
    message: MessagePayload
    session: SessionData


@router.post("/process-message")
async def process_message(request: ProcessMessageRequest):
    """
    Process a text message from WhatsApp:
    1. Extract intent using GPT-4o with structured outputs
    2. Handle conversational flow (ask follow-ups for missing fields)
    3. Save to database if complete
    4. Trigger matching if new listing
    """
    text = request.message.text or request.message.raw or ""
    session_dict = request.session.model_dump()

    # Include any attached images from the media buffer
    if request.message.attachedImages:
        session_dict["media_buffer"] = request.message.attachedImages

    result = await process_with_context(
        phone=request.phone,
        text=text,
        session=session_dict,
        source="text"
    )

    return result
