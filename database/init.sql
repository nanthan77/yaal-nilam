-- ============================================
-- YAAL NILAM — PostgreSQL Database Schema
-- AI-Powered Real Estate Platform for Jaffna
-- ============================================

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For fuzzy text search

-- ─────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────
CREATE TYPE user_type AS ENUM ('buyer', 'tenant', 'agent', 'owner', 'admin');
CREATE TYPE property_type AS ENUM ('house', 'land', 'apartment', 'commercial', 'villa', 'room');
CREATE TYPE listing_intent AS ENUM ('sell', 'rent');
CREATE TYPE requirement_intent AS ENUM ('buy', 'rent');
CREATE TYPE listing_status AS ENUM ('active', 'pending', 'sold', 'rented', 'expired', 'draft');
CREATE TYPE language_pref AS ENUM ('en', 'ta', 'tanglish');
CREATE TYPE message_type AS ENUM ('text', 'voice', 'image', 'location', 'document');
CREATE TYPE alert_status AS ENUM ('pending', 'sent', 'delivered', 'read', 'failed');

-- ─────────────────────────────────────
-- GEOGRAPHIC HIERARCHY (Jaffna-specific)
-- ─────────────────────────────────────

-- Divisional Secretariat Divisions
CREATE TABLE divisions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    name_ta VARCHAR(200) NOT NULL,
    district VARCHAR(50) DEFAULT 'Jaffna',
    boundary GEOMETRY(POLYGON, 4326), -- PostGIS polygon
    center_point GEOMETRY(POINT, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grama Niladhari (GN) Divisions — Most granular level
CREATE TABLE gn_divisions (
    id SERIAL PRIMARY KEY,
    gn_code VARCHAR(20) NOT NULL UNIQUE, -- e.g., J/101
    name VARCHAR(100) NOT NULL,
    name_ta VARCHAR(200) NOT NULL,
    division_id INTEGER REFERENCES divisions(id),
    center_point GEOMETRY(POINT, 4326),
    boundary GEOMETRY(POLYGON, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Named Places / Landmarks (for fuzzy location matching)
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_ta VARCHAR(300),
    aliases TEXT[], -- Array of alternative names/spellings
    place_type VARCHAR(50), -- 'temple', 'school', 'hospital', 'market', 'junction', 'area'
    gn_division_id INTEGER REFERENCES gn_divisions(id),
    division_id INTEGER REFERENCES divisions(id),
    location GEOMETRY(POINT, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_places_location ON places USING GIST(location);
CREATE INDEX idx_places_name_trgm ON places USING GIN(name gin_trgm_ops);

-- ─────────────────────────────────────
-- USERS
-- ─────────────────────────────────────
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL, -- WhatsApp number (E.164 format)
    name VARCHAR(200),
    name_ta VARCHAR(300),
    email VARCHAR(255),
    user_type user_type DEFAULT 'buyer',
    language_pref language_pref DEFAULT 'ta',
    whatsapp_name VARCHAR(200), -- Name from WhatsApp profile
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_agent BOOLEAN DEFAULT FALSE,
    agent_license VARCHAR(50),
    agency_name VARCHAR(200),
    bio TEXT,
    areas_served INTEGER[], -- Array of division IDs
    total_listings INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone_number);

-- ─────────────────────────────────────
-- PROPERTY LISTINGS
-- ─────────────────────────────────────
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_code VARCHAR(20) UNIQUE, -- Human-readable: YN-2026-0001
    agent_phone VARCHAR(20) NOT NULL REFERENCES users(phone_number),

    -- Property Details
    intent listing_intent NOT NULL,
    property_type property_type NOT NULL,
    title VARCHAR(300),
    title_ta VARCHAR(500),
    description TEXT,
    description_ta TEXT,

    -- Pricing
    price NUMERIC(15, 2) NOT NULL, -- Always stored in LKR
    price_negotiable BOOLEAN DEFAULT TRUE,

    -- Size & Rooms
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    sqft NUMERIC(10, 2) DEFAULT 0,
    land_size_perches NUMERIC(10, 2) DEFAULT 0,

    -- Location
    division_id INTEGER REFERENCES divisions(id),
    gn_division_id INTEGER REFERENCES gn_divisions(id),
    address TEXT,
    address_ta TEXT,
    location GEOMETRY(POINT, 4326), -- Lat/Lng point

    -- Media
    media_urls TEXT[] DEFAULT '{}', -- S3 image URLs
    thumbnail_url TEXT,

    -- Features
    features JSONB DEFAULT '{}',
    -- Example: {"parking": 2, "furnished": true, "well_water": true, "solar": false}

    year_built INTEGER,

    -- Status
    status listing_status DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,

    -- Source tracking
    source VARCHAR(20) DEFAULT 'whatsapp', -- 'whatsapp', 'web', 'agent_portal'
    raw_message TEXT, -- Original WhatsApp message for debugging

    -- Timestamps
    listed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_location ON listings USING GIST(location);
CREATE INDEX idx_listings_type ON listings(property_type, intent, status);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_division ON listings(division_id);
CREATE INDEX idx_listings_status ON listings(status) WHERE status = 'active';
CREATE INDEX idx_listings_agent ON listings(agent_phone);

-- Auto-generate listing codes
CREATE OR REPLACE FUNCTION generate_listing_code()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(listing_code FROM 9) AS INTEGER)), 0) + 1
    INTO next_num
    FROM listings
    WHERE listing_code LIKE 'YN-' || TO_CHAR(NOW(), 'YYYY') || '-%';

    NEW.listing_code := 'YN-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(next_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_listing_code
    BEFORE INSERT ON listings
    FOR EACH ROW
    WHEN (NEW.listing_code IS NULL)
    EXECUTE FUNCTION generate_listing_code();

-- ─────────────────────────────────────
-- BUYER REQUIREMENTS
-- ─────────────────────────────────────
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_phone VARCHAR(20) NOT NULL REFERENCES users(phone_number),

    intent requirement_intent NOT NULL,
    property_type property_type,

    -- Location Preferences (can target multiple areas)
    target_divisions INTEGER[] DEFAULT '{}', -- Division IDs
    target_gn_divisions INTEGER[] DEFAULT '{}', -- GN Division IDs
    target_location_names TEXT[] DEFAULT '{}', -- Raw location names from user
    search_center GEOMETRY(POINT, 4326), -- For radius search
    search_radius_km NUMERIC(5, 2) DEFAULT 10.0,

    -- Budget
    min_budget NUMERIC(15, 2),
    max_budget NUMERIC(15, 2),

    -- Size Preferences
    min_bedrooms INTEGER,
    max_bedrooms INTEGER,
    min_bathrooms INTEGER,
    min_sqft NUMERIC(10, 2),
    min_land_perches NUMERIC(10, 2),

    -- Feature Preferences
    preferred_features JSONB DEFAULT '{}',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    match_count INTEGER DEFAULT 0,
    last_matched_at TIMESTAMPTZ,

    -- Source
    raw_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requirements_active ON requirements(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_requirements_user ON requirements(user_phone);
CREATE INDEX idx_requirements_search ON requirements USING GIST(search_center);

-- ─────────────────────────────────────
-- MATCH ALERTS (Auto-Matchmaker Output)
-- ─────────────────────────────────────
CREATE TABLE match_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id),
    requirement_id UUID NOT NULL REFERENCES requirements(id),
    user_phone VARCHAR(20) NOT NULL,

    match_score NUMERIC(5, 2) NOT NULL, -- 0-100 percentage
    score_breakdown JSONB, -- {"distance": 28, "budget": 30, "bedrooms": 18, "bathrooms": 16}

    status alert_status DEFAULT 'pending',
    whatsapp_message_id VARCHAR(100), -- Meta message ID for delivery tracking

    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_pending ON match_alerts(status) WHERE status = 'pending';
CREATE INDEX idx_alerts_listing ON match_alerts(listing_id);
CREATE UNIQUE INDEX idx_alerts_unique ON match_alerts(listing_id, requirement_id);

-- ─────────────────────────────────────
-- CONVERSATIONS (WhatsApp Session Tracking)
-- ─────────────────────────────────────
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_phone VARCHAR(20) NOT NULL REFERENCES users(phone_number),

    -- Session state
    current_flow VARCHAR(50), -- 'buyer_requirement', 'listing_creation', 'inquiry', 'general'
    flow_state JSONB DEFAULT '{}', -- Partial data collected so far
    pending_fields TEXT[] DEFAULT '{}', -- Fields still needed

    -- Media buffer (for grouping multi-image messages)
    media_buffer TEXT[] DEFAULT '{}',
    media_buffer_started_at TIMESTAMPTZ,

    -- Context
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    is_within_24h BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_phone ON conversations(user_phone);
CREATE INDEX idx_conversations_active ON conversations(last_message_at DESC);

-- ─────────────────────────────────────
-- MESSAGE LOG (Audit Trail)
-- ─────────────────────────────────────
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_phone VARCHAR(20) NOT NULL,
    direction VARCHAR(10) NOT NULL, -- 'inbound' or 'outbound'
    message_type message_type NOT NULL,

    -- Content
    raw_text TEXT, -- Original message text
    transcribed_text TEXT, -- From Whisper STT (if voice)
    extracted_json JSONB, -- LLM-extracted structured data

    -- Media
    media_url TEXT,
    media_mime VARCHAR(50),

    -- WhatsApp metadata
    wa_message_id VARCHAR(100),
    wa_timestamp TIMESTAMPTZ,

    -- AI processing
    intent_detected VARCHAR(100),
    confidence_score NUMERIC(4, 3),
    processing_time_ms INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_phone ON messages(user_phone, created_at DESC);

-- ─────────────────────────────────────
-- INQUIRIES (Buyer → Listing contact)
-- ─────────────────────────────────────
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id),
    buyer_phone VARCHAR(20) NOT NULL,
    agent_phone VARCHAR(20) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'new', -- 'new', 'responded', 'closed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- SAVED SEARCHES (Web portal)
-- ─────────────────────────────────────
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    search_params JSONB NOT NULL,
    alert_enabled BOOLEAN DEFAULT TRUE,
    last_alerted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────
-- UTILITY FUNCTIONS
-- ─────────────────────────────────────

-- Haversine distance function (returns km)
CREATE OR REPLACE FUNCTION haversine_km(
    lat1 DOUBLE PRECISION, lng1 DOUBLE PRECISION,
    lat2 DOUBLE PRECISION, lng2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
DECLARE
    R CONSTANT DOUBLE PRECISION := 6371.0; -- Earth radius in km
    dlat DOUBLE PRECISION;
    dlng DOUBLE PRECISION;
    a DOUBLE PRECISION;
BEGIN
    dlat := RADIANS(lat2 - lat1);
    dlng := RADIANS(lng2 - lng1);
    a := SIN(dlat/2) * SIN(dlat/2) + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dlng/2) * SIN(dlng/2);
    RETURN R * 2 * ATAN2(SQRT(a), SQRT(1 - a));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Normalize Sri Lankan price text to LKR numeric
-- "45 Lakhs" → 4500000, "3.2 million" → 3200000, "2 Crore" → 20000000
CREATE OR REPLACE FUNCTION normalize_price_lkr(
    amount NUMERIC,
    unit VARCHAR(20)
) RETURNS NUMERIC AS $$
BEGIN
    CASE LOWER(unit)
        WHEN 'lakhs', 'laks', 'lakh' THEN RETURN amount * 100000;
        WHEN 'million', 'millions', 'm' THEN RETURN amount * 1000000;
        WHEN 'crore', 'crores', 'kodi' THEN RETURN amount * 10000000;
        ELSE RETURN amount; -- Assume raw LKR
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Convert Parappu to Perches (Jaffna-specific land unit)
-- 1 Parappu = 10 Perches
CREATE OR REPLACE FUNCTION parappu_to_perches(parappu NUMERIC) RETURNS NUMERIC AS $$
BEGIN
    RETURN parappu * 10;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_requirements_updated_at BEFORE UPDATE ON requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
