-- ============================================
-- YAAL NILAM — Jaffna Geospatial Seed Data
-- Complete Divisional Secretariat & GN mapping
-- ============================================

-- ─────────────────────────────────────
-- DIVISIONAL SECRETARIATS (DS Divisions)
-- ─────────────────────────────────────
INSERT INTO divisions (id, name, name_ta, district, center_point) VALUES
(1,  'Jaffna',              'யாழ்ப்பாணம்',          'Jaffna', ST_SetSRID(ST_MakePoint(80.0255, 9.6615), 4326)),
(2,  'Nallur',              'நல்லூர்',              'Jaffna', ST_SetSRID(ST_MakePoint(80.0255, 9.6685), 4326)),
(3,  'Valikamam North',     'வலிகாமம் வடக்கு',      'Jaffna', ST_SetSRID(ST_MakePoint(80.0167, 9.7333), 4326)),
(4,  'Valikamam South',     'வலிகாமம் தெற்கு',      'Jaffna', ST_SetSRID(ST_MakePoint(80.0519, 9.6700), 4326)),
(5,  'Valikamam East',      'வலிகாமம் கிழக்கு',     'Jaffna', ST_SetSRID(ST_MakePoint(80.0678, 9.7419), 4326)),
(6,  'Valikamam West',      'வலிகாமம் மேற்கு',      'Jaffna', ST_SetSRID(ST_MakePoint(80.0333, 9.7167), 4326)),
(7,  'Vadamarachchi North', 'வடமராட்சி வடக்கு',     'Jaffna', ST_SetSRID(ST_MakePoint(80.2333, 9.8167), 4326)),
(8,  'Vadamarachchi South', 'வடமராட்சி தெற்கு',     'Jaffna', ST_SetSRID(ST_MakePoint(80.2000, 9.7500), 4326)),
(9,  'Vadamarachchi East',  'வடமராட்சி கிழக்கு',    'Jaffna', ST_SetSRID(ST_MakePoint(80.2500, 9.7800), 4326)),
(10, 'Thenmarachchi',       'தென்மராட்சி',           'Jaffna', ST_SetSRID(ST_MakePoint(80.1612, 9.6611), 4326)),
(11, 'Sandilipay',          'சண்டிலிப்பாய்',        'Jaffna', ST_SetSRID(ST_MakePoint(80.0500, 9.7000), 4326)),
(12, 'Karainagar',          'காரைநகர்',             'Jaffna', ST_SetSRID(ST_MakePoint(79.9028, 9.7422), 4326)),
(13, 'Velanai',             'வேலணை',               'Jaffna', ST_SetSRID(ST_MakePoint(79.8833, 9.6833), 4326)),
(14, 'Island North',        'தீவு வடக்கு',           'Jaffna', ST_SetSRID(ST_MakePoint(79.8500, 9.6500), 4326)),
(15, 'Island South',        'தீவு தெற்கு',           'Jaffna', ST_SetSRID(ST_MakePoint(79.8700, 9.6200), 4326));

-- ─────────────────────────────────────
-- KEY GN DIVISIONS (Sample — Jaffna Municipal Council area)
-- ─────────────────────────────────────
INSERT INTO gn_divisions (gn_code, name, name_ta, division_id, center_point) VALUES
-- Jaffna Town
('J/101', 'Grand Bazaar',      'கிராண்ட் பசார்',      1, ST_SetSRID(ST_MakePoint(80.0170, 9.6610), 4326)),
('J/102', 'Vannarpannai',      'வண்ணார்பண்ணை',      1, ST_SetSRID(ST_MakePoint(80.0230, 9.6580), 4326)),
('J/103', 'Kandarmadam',       'கந்தர்மடம்',         1, ST_SetSRID(ST_MakePoint(80.0280, 9.6650), 4326)),
('J/104', 'Gurunagar',         'குருநகர்',            1, ST_SetSRID(ST_MakePoint(80.0100, 9.6550), 4326)),
('J/105', 'Kokkuvil',          'கொக்குவில்',          1, ST_SetSRID(ST_MakePoint(80.0350, 9.6700), 4326)),
('J/106', 'Thirunelvely',      'திருநெல்வேலி',       1, ST_SetSRID(ST_MakePoint(80.0400, 9.6750), 4326)),
('J/107', 'Kondavil',          'கொண்டாவில்',         1, ST_SetSRID(ST_MakePoint(80.0450, 9.6600), 4326)),
('J/108', 'Kokuvil West',      'கொக்குவில் மேற்கு',   1, ST_SetSRID(ST_MakePoint(80.0300, 9.6720), 4326)),
('J/109', 'Chundikuli',        'சுண்டிக்குளி',       1, ST_SetSRID(ST_MakePoint(80.0200, 9.6640), 4326)),
('J/110', 'Passaiyoor',        'பருத்தியூர்',         1, ST_SetSRID(ST_MakePoint(80.0050, 9.6500), 4326)),

-- Nallur
('J/201', 'Nallur North',      'நல்லூர் வடக்கு',      2, ST_SetSRID(ST_MakePoint(80.0260, 9.6720), 4326)),
('J/202', 'Nallur South',      'நல்லூர் தெற்கு',      2, ST_SetSRID(ST_MakePoint(80.0250, 9.6660), 4326)),
('J/203', 'Nallur Rajathany',  'நல்லூர் இராஜதானி',    2, ST_SetSRID(ST_MakePoint(80.0255, 9.6690), 4326)),
('J/204', 'Sangiliyan Thoppu', 'சங்கிலியன் தோப்பு',   2, ST_SetSRID(ST_MakePoint(80.0270, 9.6700), 4326)),

-- Kopay (Valikamam South)
('J/301', 'Kopay North',       'கோப்பாய் வடக்கு',     4, ST_SetSRID(ST_MakePoint(80.0500, 9.6750), 4326)),
('J/302', 'Kopay South',       'கோப்பாய் தெற்கு',     4, ST_SetSRID(ST_MakePoint(80.0520, 9.6680), 4326)),
('J/303', 'Urumpirai',         'உரும்பிராய்',         4, ST_SetSRID(ST_MakePoint(80.0550, 9.6650), 4326)),
('J/304', 'Ilavalai',          'இலவாலை',            4, ST_SetSRID(ST_MakePoint(80.0580, 9.6700), 4326)),

-- Chunnakam (Valikamam East)
('J/401', 'Chunnakam',         'சுன்னாகம்',           5, ST_SetSRID(ST_MakePoint(80.0678, 9.7419), 4326)),
('J/402', 'Erlalai',           'ஏறாலை',             5, ST_SetSRID(ST_MakePoint(80.0700, 9.7350), 4326)),

-- Manipay (Valikamam West)
('J/501', 'Manipay',           'மாணிப்பாய்',          6, ST_SetSRID(ST_MakePoint(80.0333, 9.7167), 4326)),

-- Tellippalai (Valikamam North)
('J/601', 'Tellippalai',       'தெல்லிப்பளை',        3, ST_SetSRID(ST_MakePoint(80.0167, 9.7333), 4326)),
('J/602', 'Maviddapuram',      'மாவிட்டபுரம்',       3, ST_SetSRID(ST_MakePoint(80.0100, 9.7400), 4326)),

-- Chavakachcheri (Thenmarachchi)
('J/701', 'Chavakachcheri',    'சாவகச்சேரி',         10, ST_SetSRID(ST_MakePoint(80.1612, 9.6611), 4326)),
('J/702', 'Kodikamam',         'கொடிகாமம்',          10, ST_SetSRID(ST_MakePoint(80.1500, 9.6667), 4326)),
('J/703', 'Kaithady',          'கைதடி',              10, ST_SetSRID(ST_MakePoint(80.1300, 9.6700), 4326)),

-- Point Pedro (Vadamarachchi North)
('J/801', 'Point Pedro',       'பருத்தித்துறை',       7, ST_SetSRID(ST_MakePoint(80.2333, 9.8167), 4326)),
('J/802', 'Valvettithurai',    'வல்வெட்டித்துறை',     7, ST_SetSRID(ST_MakePoint(80.1667, 9.8333), 4326)),

-- Karainagar
('J/901', 'Karainagar',        'காரைநகர்',           12, ST_SetSRID(ST_MakePoint(79.9028, 9.7422), 4326)),

-- Kayts (Velanai)
('J/1001', 'Kayts',            'காய்ட்ஸ்',           13, ST_SetSRID(ST_MakePoint(79.8833, 9.6833), 4326));

-- ─────────────────────────────────────
-- NAMED PLACES & LANDMARKS
-- ─────────────────────────────────────
INSERT INTO places (name, name_ta, aliases, place_type, division_id, gn_division_id, location) VALUES
-- Temples
('Nallur Kandaswamy Temple', 'நல்லூர் கந்தசுவாமி கோவில்', ARRAY['Nallur Kovil', 'Nallur Temple', 'Kandaswamy'], 'temple', 2, NULL, ST_SetSRID(ST_MakePoint(80.0255, 9.6685), 4326)),
('Naguleswaram Temple', 'நாகுலேஸ்வரம் கோவில்', ARRAY['Naguleswaram', 'Keerimalai Temple'], 'temple', 3, NULL, ST_SetSRID(ST_MakePoint(80.0050, 9.7500), 4326)),

-- Schools
('Jaffna Hindu College', 'யாழ் இந்துக் கல்லூரி', ARRAY['Hindu College', 'JHC'], 'school', 1, NULL, ST_SetSRID(ST_MakePoint(80.0230, 9.6630), 4326)),
('St. Johns College', 'செயின்ட் ஜோன்ஸ் கல்லூரி', ARRAY['St Johns', 'SJC Jaffna'], 'school', 1, NULL, ST_SetSRID(ST_MakePoint(80.0200, 9.6620), 4326)),
('Jaffna Central College', 'யாழ் மத்திய கல்லூரி', ARRAY['Central College', 'Jaffna Central'], 'school', 1, NULL, ST_SetSRID(ST_MakePoint(80.0180, 9.6600), 4326)),
('Chundikuli Girls College', 'சுண்டிக்குளி மகளிர் கல்லூரி', ARRAY['Chundikuli Girls', 'CGC'], 'school', 1, NULL, ST_SetSRID(ST_MakePoint(80.0210, 9.6645), 4326)),

-- Hospitals
('Jaffna Teaching Hospital', 'யாழ் போதனா வைத்தியசாலை', ARRAY['Jaffna Hospital', 'Teaching Hospital', 'JTH'], 'hospital', 1, NULL, ST_SetSRID(ST_MakePoint(80.0200, 9.6580), 4326)),

-- Markets & Commercial
('Jaffna Market', 'யாழ் சந்தை', ARRAY['Main Market', 'Jaffna Bazaar'], 'market', 1, NULL, ST_SetSRID(ST_MakePoint(80.0170, 9.6610), 4326)),
('KKS Road', 'கே.கே.எஸ். வீதி', ARRAY['KKS Road', 'Kankesanthurai Road'], 'road', 1, NULL, ST_SetSRID(ST_MakePoint(80.0150, 9.6650), 4326)),

-- Junctions
('Chunnakam Junction', 'சுன்னாகம் சந்தி', ARRAY['Chunnakam Town', 'Chunnakam Center'], 'junction', 5, NULL, ST_SetSRID(ST_MakePoint(80.0678, 9.7419), 4326)),
('Kopay Junction', 'கோப்பாய் சந்தி', ARRAY['Kopay Town', 'Kopay Center'], 'junction', 4, NULL, ST_SetSRID(ST_MakePoint(80.0519, 9.6700), 4326)),

-- Universities
('University of Jaffna', 'யாழ்ப்பாணப் பல்கலைக்கழகம்', ARRAY['Jaffna Uni', 'UoJ', 'Jaffna University'], 'university', 4, NULL, ST_SetSRID(ST_MakePoint(80.0450, 9.6830), 4326));

-- ─────────────────────────────────────
-- SAMPLE DEMO USER (for testing)
-- ─────────────────────────────────────
INSERT INTO users (phone_number, name, name_ta, user_type, language_pref, is_verified) VALUES
('+94771234567', 'Demo Buyer', 'டெமோ வாங்குபவர்', 'buyer', 'ta', TRUE),
('+94772345678', 'Demo Agent', 'டெமோ முகவர்', 'agent', 'en', TRUE);
