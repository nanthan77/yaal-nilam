# Yaal Nilam — WhatsApp-First AI Matchmaker MVP Spec

## User Flows

### Flow A: Buyer/Tenant (Saving a Requirement)
1. User sends text/voice → STT if audio → LLM extracts JSON
2. Bot asks follow-ups for missing fields (budget, location)
3. Save to Requirements table → Confirm to user

### Flow B: Agent/Owner (Posting a Listing)
1. Agent sends photos + text/voice → Group via session manager
2. Images → S3 → LLM extracts listing JSON
3. Save to Listings table → Return formatted summary + Listing ID

### Flow C: Auto-Matchmaker (Alerts)
1. Trigger on new Listing insert
2. Match against Requirements (location + budget + type)
3. Send WhatsApp Template Message to matched buyers

## Key Constraints
- WhatsApp 24-hour rule → Template Messages for outbound alerts
- .ogg → ffmpeg → .mp3 → Whisper API for voice notes
- Tanglish support: "Enaku Nallur la land venum" → structured JSON
- Sri Lankan units: Lakhs, Perches, Parappu normalization
- Session grouping: Redis timeout to batch multi-image messages

## Phased Deliverables
- Phase 1: Webhook & Echo Bot
- Phase 2: AI Parsing & Voice Notes
- Phase 3: Image Handling & Conversational Flow
- Phase 4: Matchmaker & Template Alerts
