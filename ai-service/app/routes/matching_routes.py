"""
Property Matching Routes
Endpoints for triggering and querying the matching engine.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from app.services.matcher import trigger_matching, calculate_match_score, MATCH_THRESHOLD

router = APIRouter()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/yaalnilam")


def get_connection():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)


# ── Request / Response Models ──────────────────────────────────────

class TriggerMatchRequest(BaseModel):
    listing_id: str


class MatchScoreRequest(BaseModel):
    listing: Dict[str, Any]
    requirement: Dict[str, Any]


class MatchAlert(BaseModel):
    id: str
    listing_id: str
    requirement_id: str
    user_phone: str
    match_score: float
    score_breakdown: Optional[Dict[str, Any]] = None
    status: str
    created_at: Optional[str] = None


# ── Endpoints ──────────────────────────────────────────────────────

@router.post("/matching/trigger")
async def trigger_match(request: TriggerMatchRequest):
    """
    Trigger the matching engine for a specific listing.
    Compares the listing against all active buyer requirements
    and creates match_alerts for scores above threshold.
    """
    match_count = await trigger_matching(request.listing_id)
    return {
        "listing_id": request.listing_id,
        "matches_found": match_count,
        "threshold": MATCH_THRESHOLD,
        "status": "completed"
    }


@router.post("/matching/score")
async def calculate_score(request: MatchScoreRequest):
    """
    Calculate the match score between a listing and a requirement
    without persisting anything. Useful for previews and testing.
    """
    result = calculate_match_score(request.listing, request.requirement)
    result["is_match"] = result["total_score"] >= MATCH_THRESHOLD
    result["threshold"] = MATCH_THRESHOLD
    return result


@router.get("/matching/alerts")
async def get_alerts(
    phone: Optional[str] = Query(None, description="Filter by user phone number"),
    listing_id: Optional[str] = Query(None, description="Filter by listing ID"),
    status: Optional[str] = Query(None, description="Filter by status: pending, sent, viewed, dismissed"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Retrieve match alerts, optionally filtered by phone, listing, or status.
    Returns alerts sorted by match score (highest first).
    """
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
            SELECT ma.id, ma.listing_id, ma.requirement_id, ma.user_phone,
                   ma.match_score, ma.score_breakdown, ma.status, ma.created_at,
                   l.property_type, l.address, l.price, l.listing_code
            FROM match_alerts ma
            JOIN listings l ON l.id = ma.listing_id
            WHERE 1=1
        """
        params = []

        if phone:
            query += " AND ma.user_phone = %s"
            params.append(phone)
        if listing_id:
            query += " AND ma.listing_id = %s"
            params.append(listing_id)
        if status:
            query += " AND ma.status = %s"
            params.append(status)

        query += " ORDER BY ma.match_score DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cur.execute(query, params)
        alerts = cur.fetchall()

        # Get total count
        count_query = "SELECT COUNT(*) as total FROM match_alerts WHERE 1=1"
        count_params = []
        if phone:
            count_query += " AND user_phone = %s"
            count_params.append(phone)
        if listing_id:
            count_query += " AND listing_id = %s"
            count_params.append(listing_id)
        if status:
            count_query += " AND status = %s"
            count_params.append(status)

        cur.execute(count_query, count_params)
        total = cur.fetchone()["total"]

        cur.close()
        conn.close()

        # Serialize datetime objects
        for alert in alerts:
            if alert.get("created_at"):
                alert["created_at"] = str(alert["created_at"])
            if alert.get("score_breakdown") and isinstance(alert["score_breakdown"], str):
                alert["score_breakdown"] = json.loads(alert["score_breakdown"])

        return {
            "alerts": alerts,
            "total": total,
            "limit": limit,
            "offset": offset
        }

    except Exception as e:
        print(f"Get alerts error: {e}")
        # Return empty in dev mode
        return {"alerts": [], "total": 0, "limit": limit, "offset": offset}


@router.patch("/matching/alerts/{alert_id}")
async def update_alert_status(alert_id: str, status: str = Query(..., description="New status")):
    """
    Update the status of a match alert.
    Valid statuses: pending, sent, viewed, dismissed
    """
    valid_statuses = ["pending", "sent", "viewed", "dismissed"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE match_alerts SET status = %s, updated_at = NOW()
            WHERE id = %s
            RETURNING id, status
        """, (status, alert_id))

        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        if not result:
            raise HTTPException(status_code=404, detail="Alert not found")

        return {"id": result["id"], "status": result["status"], "updated": True}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Update alert error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update alert")


@router.get("/matching/stats")
async def matching_stats():
    """
    Get overall matching engine statistics.
    Useful for the admin dashboard.
    """
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT
                COUNT(*) as total_alerts,
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COUNT(*) FILTER (WHERE status = 'sent') as sent,
                COUNT(*) FILTER (WHERE status = 'viewed') as viewed,
                COUNT(*) FILTER (WHERE status = 'dismissed') as dismissed,
                ROUND(AVG(match_score)::numeric, 2) as avg_score,
                MAX(match_score) as best_score,
                COUNT(DISTINCT listing_id) as unique_listings,
                COUNT(DISTINCT requirement_id) as unique_requirements
            FROM match_alerts
        """)
        stats = cur.fetchone()

        cur.execute("SELECT COUNT(*) as total FROM requirements WHERE is_active = TRUE")
        active_reqs = cur.fetchone()["total"]

        cur.execute("SELECT COUNT(*) as total FROM listings WHERE status = 'active'")
        active_listings = cur.fetchone()["total"]

        cur.close()
        conn.close()

        return {
            "alerts": dict(stats) if stats else {},
            "active_requirements": active_reqs,
            "active_listings": active_listings,
            "threshold": MATCH_THRESHOLD
        }

    except Exception as e:
        print(f"Matching stats error: {e}")
        return {
            "alerts": {"total_alerts": 0},
            "active_requirements": 0,
            "active_listings": 0,
            "threshold": MATCH_THRESHOLD
        }
