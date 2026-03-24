"""
GPT-4o Intent Extraction Service
Extracts structured JSON from messy Tamil/English/Tanglish property messages.

System prompt is engineered to:
1. Normalize Sri Lankan currency (Lakhs, Crores, Kodi → LKR)
2. Normalize land units (Perches, Parappu → standard)
3. Handle Tanglish ("Enaku Nallur la land venum" → structured JSON)
4. Map location names to known Jaffna areas
"""

import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Known Jaffna locations for normalization
JAFFNA_LOCATIONS = {
    "nallur": "Nallur", "நல்லூர்": "Nallur",
    "kopay": "Kopay", "கோப்பாய்": "Kopay",
    "chunnakam": "Chunnakam", "சுன்னாகம்": "Chunnakam",
    "manipay": "Manipay", "மாணிப்பாய்": "Manipay",
    "chavakachcheri": "Chavakachcheri", "சாவகச்சேரி": "Chavakachcheri",
    "chavakacheri": "Chavakachcheri",
    "point pedro": "Point Pedro", "பருத்தித்துறை": "Point Pedro",
    "tellippalai": "Tellippalai", "தெல்லிப்பளை": "Tellippalai",
    "karainagar": "Karainagar", "காரைநகர்": "Karainagar",
    "kayts": "Kayts", "காய்ட்ஸ்": "Kayts",
    "thirunelvely": "Thirunelvely", "திருநெல்வேலி": "Thirunelvely",
    "kokuvil": "Kokuvil", "கொக்குவில்": "Kokuvil",
    "kondavil": "Kondavil", "கொண்டாவில்": "Kondavil",
    "urumpirai": "Urumpirai", "உரும்பிராய்": "Urumpirai",
    "erlalai": "Erlalai", "ஏறாலை": "Erlalai",
    "chankanai": "Chankanai", "சங்கானை": "Chankanai",
    "sandilipay": "Sandilipay", "சண்டிலிப்பாய்": "Sandilipay",
    "kodikamam": "Kodikamam", "கொடிகாமம்": "Kodikamam",
    "jaffna": "Jaffna Town", "யாழ்ப்பாணம்": "Jaffna Town",
    "valvettithurai": "Valvettithurai", "வல்வெட்டித்துறை": "Valvettithurai",
    "vvt": "Valvettithurai",
    "kaithady": "Kaithady", "கைதடி": "Kaithady",
    "ilavalai": "Ilavalai", "இலவாலை": "Ilavalai",
    "gurunagar": "Gurunagar", "குருநகர்": "Gurunagar",
    "passaiyoor": "Passaiyoor", "பருத்தியூர்": "Passaiyoor",
    "vannarpannai": "Vannarpannai", "வண்ணார்பண்ணை": "Vannarpannai",
}

SYSTEM_PROMPT = """You are the AI engine for Yaal Nilam (யாழ் நிலம்), a real estate platform for Jaffna, Sri Lanka.

Your job: Extract structured property data from user messages in Tamil, English, or Tanglish (Tamil written in English characters).

CRITICAL RULES:
1. CURRENCY NORMALIZATION (always convert to LKR):
   - "Lakhs"/"Laks"/"Latcham" = multiply by 100,000
   - "Million"/"M" = multiply by 1,000,000
   - "Crore"/"Crores"/"Kodi" = multiply by 10,000,000
   - Example: "45 Lakhs" → 4500000, "3.2 million" → 3200000

2. LAND SIZE NORMALIZATION:
   - "Perches" = standard unit (1 perch = 25.29 sqm)
   - "Parappu" = 10 perches (Jaffna local unit)
   - Example: "2 Parappu" → 20 perches

3. TANGLISH UNDERSTANDING:
   - "venum" = want/need
   - "irukku/irukka" = available/is there
   - "vikkanum" = want to sell
   - "vaadagai" = rent
   - "veedu" = house
   - "kaani" = land
   - "la" = in/at (location marker)
   - Example: "Enaku Nallur la 3 bedroom house venum" → intent=buy, location=Nallur, bedrooms=3

4. LOCATION MAPPING: Map to known Jaffna areas. If unclear, keep the raw text.

OUTPUT FORMAT: Always respond with valid JSON only. No explanation text.

For BUYER/TENANT messages:
{
  "intent": "buy" or "rent",
  "property_type": "house" | "land" | "apartment" | "commercial" | "villa" | "room" | null,
  "locations": ["Nallur", "Kopay"],
  "max_budget": 4500000,
  "min_budget": null,
  "bedrooms": 3,
  "bathrooms": null,
  "min_land_perches": null,
  "confidence": 0.85
}

For SELLER/AGENT messages:
{
  "intent": "sell" or "rent_out",
  "property_type": "house" | "land" | "apartment" | "commercial" | "villa",
  "location": "Thirunelvely",
  "price": 45000000,
  "bedrooms": 4,
  "bathrooms": 2,
  "land_size_perches": 15,
  "sqft": 2400,
  "features": ["garden", "well_water", "boundary_wall"],
  "confidence": 0.90
}

For UNCLEAR messages:
{
  "intent": "unclear",
  "partial_data": {},
  "missing_fields": ["intent", "location", "budget"],
  "confidence": 0.3
}"""


async def extract_intent(text: str, session_context: dict = None) -> dict:
    """
    Extract structured property intent from user message using GPT-4o.

    Args:
        text: User's message (Tamil, English, or Tanglish)
        session_context: Current conversation state for multi-turn context

    Returns:
        Dict with extracted intent, data, and confidence score
    """
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key or api_key == "your_openai_api_key":
        return _mock_extraction(text)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add conversation context if in multi-turn flow
    if session_context and session_context.get("flow_state"):
        context_msg = f"Previous context: {json.dumps(session_context['flow_state'])}. "
        context_msg += f"Still need: {session_context.get('pending_fields', [])}."
        messages.append({"role": "assistant", "content": context_msg})

    messages.append({"role": "user", "content": text})

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.1,  # Low temperature for consistent extraction
            max_tokens=500
        )

        result = json.loads(response.choices[0].message.content)
        return result

    except Exception as e:
        print(f"Intent extraction error: {e}")
        return {
            "intent": "error",
            "confidence": 0,
            "error": str(e)
        }


def _mock_extraction(text: str) -> dict:
    """Simple keyword-based mock extraction for development"""
    text_lower = text.lower()

    # Detect buy intent
    if any(kw in text_lower for kw in ["buy", "venum", "want", "looking", "தேவை", "வேண்டும்"]):
        locations = []
        for key, val in JAFFNA_LOCATIONS.items():
            if key in text_lower:
                locations.append(val)

        return {
            "intent": "buy",
            "property_type": "house" if "house" in text_lower or "veedu" in text_lower else
                            "land" if "land" in text_lower or "kaani" in text_lower else None,
            "locations": locations or ["Jaffna Town"],
            "max_budget": 40000000,
            "bedrooms": 3,
            "confidence": 0.75
        }

    # Detect sell intent
    if any(kw in text_lower for kw in ["sell", "sale", "vikkanum", "list", "விற்பனை"]):
        return {
            "intent": "sell",
            "property_type": "house",
            "location": "Jaffna Town",
            "price": 35000000,
            "land_size_perches": 10,
            "confidence": 0.70
        }

    return {
        "intent": "unclear",
        "partial_data": {},
        "missing_fields": ["intent", "location", "budget"],
        "confidence": 0.2
    }
