"""
Property Database Service
Handles saving requirements and listings to PostgreSQL
"""

import os
import json
import uuid
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL", "")


def get_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)


async def save_requirement(phone: str, data: dict) -> str:
    """Save a buyer/tenant requirement to the database"""
    req_id = str(uuid.uuid4())
    intent = data.get("intent", "buy")
    prop_type = data.get("property_type")
    locations = data.get("locations", [])
    max_budget = data.get("max_budget")
    min_budget = data.get("min_budget")
    bedrooms = data.get("bedrooms")
    bathrooms = data.get("bathrooms")

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO requirements
            (id, user_phone, intent, property_type, target_location_names,
             max_budget, min_budget, min_bedrooms, min_bathrooms, raw_message)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            req_id, phone,
            "buy" if intent == "buy" else "rent",
            prop_type, locations,
            max_budget, min_budget,
            bedrooms, bathrooms,
            json.dumps(data)
        ))
        conn.commit()
        result = cur.fetchone()
        cur.close()
        conn.close()
        return result["id"]
    except Exception as e:
        print(f"DB save requirement error: {e}")
        # Return mock ID in dev mode
        return req_id


async def save_listing(phone: str, data: dict) -> tuple:
    """Save a property listing to the database. Returns (listing_id, listing_code)."""
    listing_id = str(uuid.uuid4())
    intent = "sell" if data.get("intent") in ("sell", "rent_out") else "sell"

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO listings
            (id, agent_phone, intent, property_type, price,
             bedrooms, bathrooms, land_size_perches, sqft,
             address, media_urls, features, source, raw_message)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'whatsapp', %s)
            RETURNING id, listing_code
        """, (
            listing_id, phone,
            "sell" if intent == "sell" else "rent",
            data.get("property_type", "house"),
            data.get("price", 0),
            data.get("bedrooms"), data.get("bathrooms"),
            data.get("land_size_perches"), data.get("sqft"),
            data.get("location", "Jaffna"),
            data.get("media_urls", []),
            json.dumps(data.get("features", {})),
            json.dumps(data)
        ))
        conn.commit()
        result = cur.fetchone()
        cur.close()
        conn.close()
        return result["id"], result["listing_code"]
    except Exception as e:
        print(f"DB save listing error: {e}")
        return listing_id, f"YN-2026-MOCK"
