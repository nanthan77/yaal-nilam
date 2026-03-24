"""
Property Matching Engine
Weighted scoring algorithm that matches new listings against buyer requirements.

Scoring Weights (from spec):
  - Distance:  30% — Haversine formula, 10km radius
  - Budget:    30% — ±25% tolerance
  - Bedrooms:  20% — ±2 room tolerance
  - Bathrooms: 20% — ±2 room tolerance

Minimum Match Score: 40% to trigger alert
"""

import os
import math
import json
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL", "")
MATCH_THRESHOLD = float(os.getenv("MATCH_SCORE_THRESHOLD", 40))
SEARCH_RADIUS_KM = float(os.getenv("DEFAULT_SEARCH_RADIUS_KM", 10))

# Scoring weights
W_DISTANCE = 0.30
W_BUDGET = 0.30
W_BEDROOMS = 0.20
W_BATHROOMS = 0.20


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two points using Haversine formula (km)."""
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def score_distance(listing_lat: float, listing_lng: float,
                   req_lat: float, req_lng: float, radius_km: float = 10.0) -> float:
    """
    Score distance component (0-100).
    Perfect score if same location, linear decay to 0 at radius boundary.
    """
    if not all([listing_lat, listing_lng, req_lat, req_lng]):
        return 50.0  # Neutral if coordinates unavailable

    dist = haversine_km(listing_lat, listing_lng, req_lat, req_lng)
    if dist > radius_km:
        return 0.0  # Outside search radius
    return max(0, 100 * (1 - dist / radius_km))


def score_budget(listing_price: float, req_max_budget: float,
                 req_min_budget: float = None, tolerance: float = 0.25) -> float:
    """
    Score budget compatibility (0-100).
    ±25% tolerance from buyer's max budget.
    """
    if not listing_price or not req_max_budget:
        return 50.0

    # Perfect score if within budget
    if listing_price <= req_max_budget:
        return 100.0

    # Tolerance zone: up to 25% over budget gets partial score
    over_budget_pct = (listing_price - req_max_budget) / req_max_budget
    if over_budget_pct <= tolerance:
        return max(0, 100 * (1 - over_budget_pct / tolerance))

    return 0.0  # Way over budget


def score_rooms(listing_count: int, req_count: int, tolerance: int = 2) -> float:
    """
    Score room count compatibility (0-100).
    ±2 room tolerance.
    """
    if req_count is None or listing_count is None:
        return 50.0  # Neutral if not specified

    diff = abs(listing_count - req_count)
    if diff == 0:
        return 100.0
    if diff <= tolerance:
        return max(0, 100 * (1 - diff / (tolerance + 1)))
    return 0.0


def calculate_match_score(listing: dict, requirement: dict) -> dict:
    """
    Calculate the weighted match score between a listing and a requirement.

    Returns:
        Dict with total score and breakdown per factor.
    """
    dist_score = score_distance(
        listing.get("lat"), listing.get("lng"),
        requirement.get("lat"), requirement.get("lng"),
        requirement.get("search_radius_km", SEARCH_RADIUS_KM)
    )

    budget_score = score_budget(
        listing.get("price"),
        requirement.get("max_budget"),
        requirement.get("min_budget")
    )

    bed_score = score_rooms(
        listing.get("bedrooms"),
        requirement.get("min_bedrooms")
    )

    bath_score = score_rooms(
        listing.get("bathrooms"),
        requirement.get("min_bathrooms")
    )

    # Weighted total
    total = (
        W_DISTANCE * dist_score +
        W_BUDGET * budget_score +
        W_BEDROOMS * bed_score +
        W_BATHROOMS * bath_score
    )

    return {
        "total_score": round(total, 2),
        "breakdown": {
            "distance": round(dist_score * W_DISTANCE, 2),
            "budget": round(budget_score * W_BUDGET, 2),
            "bedrooms": round(bed_score * W_BEDROOMS, 2),
            "bathrooms": round(bath_score * W_BATHROOMS, 2)
        }
    }


async def trigger_matching(listing_id: str) -> int:
    """
    Run matching engine for a new listing against all active requirements.
    Creates match_alerts for scores above threshold.

    Returns: Number of matches found
    """
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        cur = conn.cursor()

        # Get the new listing
        cur.execute("""
            SELECT l.*, ST_Y(l.location::geometry) as lat, ST_X(l.location::geometry) as lng
            FROM listings l WHERE l.id = %s
        """, (listing_id,))
        listing = cur.fetchone()

        if not listing:
            print(f"Listing {listing_id} not found for matching")
            return 0

        # Get all active requirements that could potentially match
        cur.execute("""
            SELECT r.*,
                   ST_Y(r.search_center::geometry) as lat,
                   ST_X(r.search_center::geometry) as lng
            FROM requirements r
            WHERE r.is_active = TRUE
        """)
        requirements = cur.fetchall()

        match_count = 0
        for req in requirements:
            # Check property type compatibility
            if req.get("property_type") and listing.get("property_type"):
                if req["property_type"] != listing["property_type"]:
                    continue

            # Check intent compatibility (buy matches sell, rent matches rent)
            if req.get("intent") == "buy" and listing.get("intent") != "sell":
                continue
            if req.get("intent") == "rent" and listing.get("intent") != "rent":
                continue

            # Location name matching (fallback when no coordinates)
            location_match = False
            if req.get("target_location_names") and listing.get("address"):
                for loc in req["target_location_names"]:
                    if loc.lower() in (listing.get("address", "").lower()):
                        location_match = True
                        break

            # Calculate score
            score_result = calculate_match_score(
                {
                    "lat": listing.get("lat"),
                    "lng": listing.get("lng"),
                    "price": float(listing.get("price", 0)),
                    "bedrooms": listing.get("bedrooms"),
                    "bathrooms": listing.get("bathrooms"),
                },
                {
                    "lat": req.get("lat"),
                    "lng": req.get("lng"),
                    "max_budget": float(req.get("max_budget", 0)) if req.get("max_budget") else None,
                    "min_budget": float(req.get("min_budget", 0)) if req.get("min_budget") else None,
                    "min_bedrooms": req.get("min_bedrooms"),
                    "min_bathrooms": req.get("min_bathrooms"),
                    "search_radius_km": float(req.get("search_radius_km", SEARCH_RADIUS_KM)),
                }
            )

            # Boost score if location names match
            if location_match:
                score_result["total_score"] = min(100, score_result["total_score"] + 15)

            # Only create alert if above threshold
            if score_result["total_score"] >= MATCH_THRESHOLD:
                try:
                    cur.execute("""
                        INSERT INTO match_alerts
                        (listing_id, requirement_id, user_phone, match_score, score_breakdown)
                        VALUES (%s, %s, %s, %s, %s)
                        ON CONFLICT (listing_id, requirement_id) DO NOTHING
                    """, (
                        listing_id, req["id"], req["user_phone"],
                        score_result["total_score"],
                        json.dumps(score_result["breakdown"])
                    ))
                    match_count += 1
                except Exception as e:
                    print(f"Match alert insert error: {e}")

        conn.commit()
        cur.close()
        conn.close()

        print(f"🔔 Matching complete: {match_count} matches for listing {listing_id}")
        return match_count

    except Exception as e:
        print(f"Matching engine error: {e}")
        return 0
