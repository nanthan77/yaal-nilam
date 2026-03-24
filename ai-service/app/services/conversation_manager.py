"""
Conversation Manager
Orchestrates the multi-turn conversational flow:
- Detects intent from user messages
- Tracks what information has been collected vs. missing
- Asks follow-up questions for missing required fields
- Saves completed requirements/listings to database
- Triggers matching engine for new listings
"""

import json
from app.services.intent_extractor import extract_intent
from app.services.property_db import save_requirement, save_listing
from app.services.matcher import trigger_matching

# Required fields by flow type
REQUIRED_FIELDS = {
    "buy": ["intent", "property_type", "locations", "max_budget"],
    "rent": ["intent", "property_type", "locations", "max_budget"],
    "sell": ["intent", "property_type", "location", "price"],
    "rent_out": ["intent", "property_type", "location", "price"],
}

# Follow-up questions (bilingual)
FOLLOW_UP_QUESTIONS = {
    "property_type": "What type of property? (House/Land/Apartment/Commercial)\nஎந்த வகை சொத்து? (வீடு/காணி/குடியிருப்பு/வணிகம்)",
    "locations": "Which area in Jaffna are you interested in?\nயாழ்ப்பாணத்தில் எந்த பகுதி?",
    "location": "Where is the property located?\nசொத்து எங்கே அமைந்துள்ளது?",
    "max_budget": "What is your budget?\nஉங்கள் பட்ஜெட் என்ன? (e.g., 300 Lakhs / 30 Million)",
    "price": "What is the asking price?\nகேட்கும் விலை என்ன? (e.g., 450 Lakhs / 45 Million)",
    "bedrooms": "How many bedrooms do you need?\nஎத்தனை படுக்கையறைகள் வேண்டும்?",
    "land_size_perches": "What is the land size? (in Perches or Parappu)\nநில அளவு என்ன? (பேர்ச் அல்லது பரப்பு)",
}


async def process_with_context(
    phone: str,
    text: str,
    session: dict,
    source: str = "text"
) -> dict:
    """
    Main orchestration function. Processes a message within conversation context.

    Args:
        phone: User's WhatsApp number
        text: Message text (or Whisper transcription)
        session: Current conversation state
        source: "text" or "voice"

    Returns:
        Dict with reply, intent, session updates, and any DB actions taken
    """

    current_flow = session.get("current_flow", "general")
    flow_state = session.get("flow_state", {})
    pending_fields = session.get("pending_fields", [])
    media_buffer = session.get("media_buffer", [])

    # Step 1: Extract intent from the message
    extracted = await extract_intent(text, session)
    intent = extracted.get("intent", "unclear")
    confidence = extracted.get("confidence", 0)

    # Step 2: Merge extracted data with existing flow state
    if intent in ("buy", "rent"):
        flow_state = _merge_data(flow_state, extracted, "buyer")
        current_flow = "buyer_requirement"
    elif intent in ("sell", "rent_out"):
        flow_state = _merge_data(flow_state, extracted, "seller")
        if media_buffer:
            flow_state["media_urls"] = media_buffer
        current_flow = "listing_creation"
    elif intent == "unclear" and current_flow != "general":
        # In an active flow — try to fill in pending fields
        flow_state = _merge_data(flow_state, extracted.get("partial_data", {}),
                                "buyer" if "buyer" in current_flow else "seller")

    # Step 3: Check what's still missing
    effective_intent = flow_state.get("intent", intent)
    if effective_intent in REQUIRED_FIELDS:
        required = REQUIRED_FIELDS[effective_intent]
        missing = [f for f in required if not flow_state.get(f)]
    else:
        missing = []

    # Step 4: If all required fields are filled, save to database
    if not missing and effective_intent in ("buy", "rent"):
        try:
            req_id = await save_requirement(phone, flow_state)
            return {
                "reply": _format_requirement_confirmation(flow_state),
                "intent": effective_intent,
                "confidence": confidence,
                "extracted_data": flow_state,
                "requirement_saved": True,
                "requirement_id": str(req_id),
                "session_update": {
                    "current_flow": "general",
                    "flow_state": {},
                    "pending_fields": []
                }
            }
        except Exception as e:
            print(f"Save requirement error: {e}")

    if not missing and effective_intent in ("sell", "rent_out"):
        try:
            listing_id, listing_code = await save_listing(phone, flow_state)

            # Trigger async matching
            match_count = await trigger_matching(listing_id)

            return {
                "reply": _format_listing_confirmation(flow_state, listing_code, match_count),
                "intent": effective_intent,
                "confidence": confidence,
                "extracted_data": flow_state,
                "listing_created": True,
                "listing_id": str(listing_id),
                "listing_code": listing_code,
                "matches_found": match_count,
                "session_update": {
                    "current_flow": "general",
                    "flow_state": {},
                    "pending_fields": [],
                    "media_buffer": [],
                    "media_buffer_started_at": None
                }
            }
        except Exception as e:
            print(f"Save listing error: {e}")

    # Step 5: Ask follow-up for the first missing field
    if missing:
        next_field = missing[0]
        question = FOLLOW_UP_QUESTIONS.get(next_field, f"Please provide: {next_field}")

        return {
            "reply": question,
            "intent": effective_intent,
            "confidence": confidence,
            "extracted_data": flow_state,
            "session_update": {
                "current_flow": current_flow,
                "flow_state": flow_state,
                "pending_fields": missing
            }
        }

    # Step 6: General/greeting response
    return {
        "reply": _greeting_response(),
        "intent": "greeting",
        "confidence": 0.9,
        "session_update": {"current_flow": "general"}
    }


def _merge_data(existing: dict, new_data: dict, role: str) -> dict:
    """Merge new extracted data into existing flow state"""
    merged = {**existing}
    for key, value in new_data.items():
        if value is not None and key != "confidence":
            merged[key] = value
    return merged


def _format_requirement_confirmation(data: dict) -> str:
    """Format a bilingual confirmation message for saved requirements"""
    intent = "buy" if data.get("intent") == "buy" else "rent"
    locations = ", ".join(data.get("locations", ["Jaffna"]))
    budget = data.get("max_budget", "N/A")

    if isinstance(budget, (int, float)) and budget >= 100000:
        budget_str = f"Rs. {budget/100000:.1f} Lakhs" if budget < 1000000 else f"Rs. {budget/1000000:.1f}M"
    else:
        budget_str = str(budget)

    return (
        f"✅ Your requirement is saved!\n\n"
        f"🏠 Intent: {'Buy' if intent == 'buy' else 'Rent'}\n"
        f"📍 Location: {locations}\n"
        f"💰 Budget: {budget_str}\n"
        f"🛏️ Bedrooms: {data.get('bedrooms', 'Any')}\n"
        f"📋 Type: {data.get('property_type', 'Any')}\n\n"
        f"We'll notify you when a matching property is listed! 🔔\n\n"
        f"உங்கள் தேவை சேமிக்கப்பட்டது! பொருத்தமான சொத்து பட்டியலிடப்படும்போது உங்களுக்கு தெரிவிப்போம்! 🔔"
    )


def _format_listing_confirmation(data: dict, listing_code: str, match_count: int) -> str:
    """Format confirmation for a newly created listing"""
    price = data.get("price", 0)
    if isinstance(price, (int, float)) and price >= 100000:
        price_str = f"Rs. {price/1000000:.1f}M" if price >= 1000000 else f"Rs. {price/100000:.1f}L"
    else:
        price_str = str(price)

    msg = (
        f"✅ Property Listed Successfully!\n\n"
        f"🆔 Listing ID: {listing_code}\n"
        f"🏠 Type: {data.get('property_type', 'N/A')}\n"
        f"📍 Location: {data.get('location', 'Jaffna')}\n"
        f"💰 Price: {price_str}\n"
    )

    if data.get("land_size_perches"):
        msg += f"📐 Land: {data['land_size_perches']} perches\n"
    if data.get("bedrooms"):
        msg += f"🛏️ Bedrooms: {data['bedrooms']}\n"

    if match_count > 0:
        msg += f"\n🔔 {match_count} potential buyer(s) will be notified!"
    else:
        msg += "\nYour listing is now live on Yaal Nilam!"

    msg += "\n\nஉங்கள் சொத்து வெற்றிகரமாக பட்டியலிடப்பட்டது! 🎉"
    return msg


def _greeting_response() -> str:
    return (
        "🏠 Welcome to *Yaal Nilam*! / யாழ் நிலத்திற்கு வருக!\n\n"
        "I can help you:\n"
        "• 🔍 *Find* a property to buy or rent\n"
        "• 📝 *List* your property for sale\n"
        "• 📊 Get *market info* for Jaffna\n\n"
        "Just tell me what you need in Tamil, English, or Tanglish!\n"
        "தமிழ், ஆங்கிலம் அல்லது தங்கிலிஷில் கூறுங்கள்! 🙏"
    )
