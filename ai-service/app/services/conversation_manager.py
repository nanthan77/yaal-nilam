"""
Conversation Manager
Orchestrates the multi-turn conversational flow:
- Detects intent from user messages
- Tracks what information has been collected vs. missing
- Asks follow-up questions for missing required fields
- Saves completed requirements/listings to database
- Triggers matching engine for new listings
"""

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

FOLLOW_UP_QUESTIONS = {
    "property_type": (
        "What type of property do you need? (House / Land / Apartment / Commercial)\n"
        "உங்களுக்கு எந்த வகை சொத்து வேண்டும்? (வீடு / காணி / அபார்ட்மென்ட் / வணிகச் சொத்து)"
    ),
    "locations": (
        "Which area in Jaffna are you interested in?\n"
        "யாழ்ப்பாணத்தில் எந்த பகுதியை விரும்புகிறீர்கள்?"
    ),
    "location": (
        "Where is the property located?\n"
        "சொத்து எந்த இடத்தில் உள்ளது?"
    ),
    "max_budget": (
        "What is your budget range?\n"
        "உங்கள் பட்ஜெட் வரம்பு என்ன? (உதா: 300 லட்சம் / 30 மில்லியன்)"
    ),
    "price": (
        "What is the asking price?\n"
        "கேட்கும் விலை என்ன? (உதா: 450 லட்சம் / 45 மில்லியன்)"
    ),
    "bedrooms": (
        "How many bedrooms do you need?\n"
        "எத்தனை படுக்கையறைகள் வேண்டும்?"
    ),
    "land_size_perches": (
        "What is the land size? (in perches or parappu)\n"
        "காணி அளவு எவ்வளவு? (பேர்ச் அல்லது பரப்பு)"
    ),
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

    extracted = await extract_intent(text, session)
    intent = extracted.get("intent", "unclear")
    confidence = extracted.get("confidence", 0)

    if intent in ("buy", "rent"):
        flow_state = _merge_data(flow_state, extracted, "buyer")
        current_flow = "buyer_requirement"
    elif intent in ("sell", "rent_out"):
        flow_state = _merge_data(flow_state, extracted, "seller")
        if media_buffer:
            flow_state["media_urls"] = media_buffer
        current_flow = "listing_creation"
    elif intent == "unclear" and current_flow != "general":
        flow_state = _merge_data(
            flow_state,
            extracted.get("partial_data", {}),
            "buyer" if "buyer" in current_flow else "seller",
        )

    effective_intent = flow_state.get("intent", intent)
    if effective_intent in REQUIRED_FIELDS:
        required = REQUIRED_FIELDS[effective_intent]
        missing = [field for field in required if not flow_state.get(field)]
    else:
        missing = []

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
                    "pending_fields": [],
                },
            }
        except Exception as error:
            print(f"Save requirement error: {error}")

    if not missing and effective_intent in ("sell", "rent_out"):
        try:
            listing_id, listing_code = await save_listing(phone, flow_state)
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
                    "media_buffer_started_at": None,
                },
            }
        except Exception as error:
            print(f"Save listing error: {error}")

    if missing:
        next_field = missing[0]
        question = FOLLOW_UP_QUESTIONS.get(
            next_field,
            f"Please share: {next_field}\nதயவுசெய்து இதை பகிருங்கள்: {next_field}",
        )

        return {
            "reply": question,
            "intent": effective_intent,
            "confidence": confidence,
            "extracted_data": flow_state,
            "session_update": {
                "current_flow": current_flow,
                "flow_state": flow_state,
                "pending_fields": missing,
            },
        }

    return {
        "reply": _greeting_response(),
        "intent": "greeting",
        "confidence": 0.9,
        "session_update": {"current_flow": "general"},
    }


def _merge_data(existing: dict, new_data: dict, role: str) -> dict:
    """Merge new extracted data into existing flow state"""
    merged = {**existing}
    for key, value in new_data.items():
        if value is not None and key != "confidence":
            merged[key] = value
    return merged


def _format_money(value):
    if isinstance(value, (int, float)):
        if value >= 10000000:
            return f"Rs. {value / 10000000:.1f} crore"
        if value >= 100000:
            return f"Rs. {value / 100000:.1f} lakhs"
        return f"Rs. {value:,.0f}"
    return str(value)


def _property_type_label_en(property_type: str) -> str:
    labels = {
        "house": "House",
        "land": "Land",
        "apartment": "Apartment",
        "commercial": "Commercial Property",
        "villa": "Villa",
    }
    return labels.get(str(property_type).lower(), str(property_type))


def _property_type_label_ta(property_type: str) -> str:
    labels = {
        "house": "வீடு",
        "land": "காணி",
        "apartment": "அபார்ட்மென்ட்",
        "commercial": "வணிகச் சொத்து",
        "villa": "வில்லா",
    }
    return labels.get(str(property_type).lower(), str(property_type))


def _intent_label_en(intent: str) -> str:
    labels = {
        "buy": "Buy",
        "rent": "Rent",
        "sell": "Sell",
        "rent_out": "Rent Out",
    }
    return labels.get(intent, intent)


def _intent_label_ta(intent: str) -> str:
    labels = {
        "buy": "வாங்க",
        "rent": "வாடகைக்கு எடுக்க",
        "sell": "விற்பனைக்கு விட",
        "rent_out": "வாடகைக்கு விட",
    }
    return labels.get(intent, intent)


def _format_requirement_confirmation(data: dict) -> str:
    """Format a bilingual confirmation message for saved requirements"""
    intent = data.get("intent", "buy")
    locations = ", ".join(data.get("locations", ["Jaffna"]))
    budget = _format_money(data.get("max_budget", "N/A"))
    bedrooms = data.get("bedrooms", "Any")
    property_type = data.get("property_type", "Any")

    return (
        "✅ Your requirement has been saved successfully.\n"
        "✅ உங்கள் தேவை வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது.\n\n"
        f"🏠 Need: {_intent_label_en(intent)} / {_intent_label_ta(intent)}\n"
        f"📍 Area: {locations}\n"
        f"💰 Budget: {budget}\n"
        f"🛏️ Bedrooms: {bedrooms}\n"
        f"📋 Type: {_property_type_label_en(property_type)} / {_property_type_label_ta(property_type)}\n\n"
        "We will message you when a matching property becomes available.\n"
        "பொருத்தமான சொத்து கிடைத்தவுடன் உங்களுக்கு செய்தி அனுப்புகிறோம்."
    )


def _format_listing_confirmation(data: dict, listing_code: str, match_count: int) -> str:
    """Format confirmation for a newly created listing"""
    price = _format_money(data.get("price", 0))
    property_type = data.get("property_type", "N/A")

    message = (
        "✅ Your property has been listed successfully.\n"
        "✅ உங்கள் சொத்து வெற்றிகரமாக பட்டியலிடப்பட்டுள்ளது.\n\n"
        f"🆔 Listing ID: {listing_code}\n"
        f"🏠 Type: {_property_type_label_en(property_type)} / {_property_type_label_ta(property_type)}\n"
        f"📍 Location: {data.get('location', 'Jaffna')}\n"
        f"💰 Price: {price}\n"
    )

    if data.get("land_size_perches"):
        message += f"📐 Land Size: {data['land_size_perches']} perches\n"
    if data.get("bedrooms"):
        message += f"🛏️ Bedrooms: {data['bedrooms']}\n"

    if match_count > 0:
        message += (
            f"\n🔔 {match_count} potential buyer or renter match(es) will be notified.\n"
            f"🔔 பொருத்தமான {match_count} பேருக்கு அறிவிப்பு அனுப்பப்படும்."
        )
    else:
        message += (
            "\nYour listing is now live on Yaal Nilam.\n"
            "உங்கள் பட்டியல் இப்போது யாழ் நிலத்தில் செயலில் உள்ளது."
        )

    return message


def _greeting_response() -> str:
    return (
        "🏠 Welcome to Yaal Nilam.\n"
        "I can help you buy, rent, or list property in Jaffna.\n"
        "Send your requirement in Tamil, English, or Tanglish.\n\n"
        "🏠 யாழ் நிலத்திற்கு வரவேற்கிறோம்.\n"
        "யாழ்ப்பாணத்தில் வாங்க, வாடகைக்கு எடுக்க, அல்லது சொத்தைப் பட்டியலிட உதவுகிறோம்.\n"
        "தமிழ், English அல்லது Tanglish-ல் உங்கள் தேவையை அனுப்புங்கள்."
    )
