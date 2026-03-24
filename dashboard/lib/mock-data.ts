// ========================
// TYPE DEFINITIONS
// ========================

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'archived' | 'draft';
export type InquiryStatus = 'new' | 'contacted' | 'interested' | 'negotiating' | 'site_visit' | 'no_answer' | 'closed_won' | 'closed_lost' | 'spam';
export type RequirementStatus = 'new' | 'in_progress' | 'matched_partial' | 'matched_full' | 'closed';
export type UserRole = 'super_admin' | 'admin' | 'content_manager' | 'listing_manager' | 'lead_manager' | 'viewer';
export type LeadPriority = 'hot' | 'warm' | 'cold';
export type LeadSource = 'website_form' | 'whatsapp' | 'facebook' | 'google' | 'phone' | 'referral' | 'walk_in';

export interface Inquiry {
  id: string; listing_id: string; listing_title: string; customer_name: string;
  phone: string; whatsapp: string; email: string; message: string;
  source: string; status: string; priority: string; assigned_to: string;
  notes: string; follow_up_date?: string; created_at: string;
}

export interface Requirement {
  id: string; customer_name: string; phone: string; whatsapp: string;
  intent: string; property_type: string; preferred_area: string;
  budget_min: number; budget_max: number; bedrooms?: number; land_size?: string;
  urgency: string; notes: string; status: string; matches_count: number; created_at: string;
}

export interface Agent {
  id: string; name: string; company: string; phone: string; whatsapp: string;
  email: string; verified: boolean; nic_uploaded: boolean;
  service_areas: string[]; specializations: string[];
  active_listings: number; total_inquiries: number; response_rate: number;
  status: string; joined_date: string;
}

export interface DashboardUser {
  id: string; name: string; email: string; phone: string;
  role: string; status: string; last_login: string; created_at: string;
}

export interface Area {
  id: string; name: string; name_ta: string; slug: string;
  district: string; listings_count: number; featured: boolean; status: string;
}

export interface BlogPost {
  id: string; title: string; slug: string; category: string;
  status: string; author: string; created_at: string; views: number;
}

export interface AuditLog {
  id: string; user: string; action: string; target: string;
  details: string; timestamp: string;
}

export interface Notification {
  id: string; title: string; message: string; type: string;
  read: boolean; created_at: string;
}

// ========================
// MOCK DATA
// ========================

export const DASHBOARD_STATS = {
  activeListings: { value: 623, change: 5.2, trend: "up" },
  pendingApproval: { value: 48, change: 0, trend: "stable", badge: "warning" },
  todayInquiries: { value: 18, change: 12, trend: "up" },
  whatsappLeads: { value: 12, change: 8.5, trend: "up" },
  activeRequirements: { value: 189, change: 3.1, trend: "up" },
  matchesToday: { value: 7, change: 0, trend: "stable" },
  revenueThisMonth: { value: 185000, change: 12.5, trend: "up", currency: "Rs." },
  conversionRate: { value: 8.3, change: 0.5, trend: "up" },
};

export const MOCK_LISTINGS = [
  { id: "list-001", title: "Luxury Villa in Jaffna Fort", area: "Jaffna Fort", price: 2500000, type: "Villa", status: "pending", agent: "Kamalan Ravi", date: new Date(Date.now() - 2*60*60*1000), images: 8, missing: [] },
  { id: "list-002", title: "Spacious Apartment - Central Jaffna", area: "Central Jaffna", price: 1200000, type: "Apartment", status: "pending", agent: "Priya Durai", date: new Date(Date.now() - 4*60*60*1000), images: 5, missing: ["images"] },
  { id: "list-003", title: "Land Plot - Kopay", area: "Kopay", price: 850000, type: "Land", status: "pending", agent: "Ravi Kumar", date: new Date(Date.now() - 6*60*60*1000), images: 2, missing: ["images","price"] },
  { id: "list-004", title: "Commercial Space - Main Street", area: "Main Street", price: 3500000, type: "Commercial", status: "pending", agent: "Anita Singh", date: new Date(Date.now() - 8*60*60*1000), images: 6, missing: [] },
  { id: "list-005", title: "Cottage in Nallur", area: "Nallur", price: 950000, type: "House", status: "pending", agent: "Kamalan Ravi", date: new Date(Date.now() - 10*60*60*1000), images: 4, missing: ["price"] },
  { id: "list-006", title: "Residential Complex - Mullaitivu", area: "Mullaitivu", price: 2800000, type: "Apartment", status: "approved", agent: "Priya Durai", date: new Date(Date.now() - 24*60*60*1000), images: 12, missing: [] },
  { id: "list-007", title: "Beach Front Property", area: "Jaffna Fort", price: 5200000, type: "Villa", status: "approved", agent: "Ravi Kumar", date: new Date(Date.now() - 48*60*60*1000), images: 15, missing: [] },
];

export const INQUIRIES_WEEKLY = [
  { day: "Mon", count: 14 }, { day: "Tue", count: 18 }, { day: "Wed", count: 22 },
  { day: "Thu", count: 19 }, { day: "Fri", count: 25 }, { day: "Sat", count: 21 }, { day: "Sun", count: 18 },
];

export const DEMAND_VS_SUPPLY = [
  { area: "Jaffna Fort", demand: 45, supply: 32 }, { area: "Central Jaffna", demand: 38, supply: 28 },
  { area: "Nallur", demand: 28, supply: 22 }, { area: "Kopay", demand: 35, supply: 31 },
  { area: "Mullaitivu", demand: 18, supply: 25 }, { area: "Valikamam", demand: 22, supply: 18 },
];

export const LISTINGS_BY_TYPE = [
  { type: "Apartment", count: 234, percentage: 37.5 }, { type: "House", count: 156, percentage: 25.0 },
  { type: "Villa", count: 118, percentage: 18.9 }, { type: "Land", count: 78, percentage: 12.5 },
  { type: "Commercial", count: 37, percentage: 6.1 },
];

export const TOP_AREAS = [
  { area: "Jaffna Fort", count: 156, percentage: 25.0 }, { area: "Central Jaffna", count: 132, percentage: 21.2 },
  { area: "Nallur", count: 98, percentage: 15.7 }, { area: "Kopay", count: 87, percentage: 13.9 },
  { area: "Valikamam", count: 78, percentage: 12.5 }, { area: "Mullaitivu", count: 72, percentage: 11.5 },
];

export const MOCK_INQUIRIES: Inquiry[] = [
  { id: 'INQ001', listing_id: 'L001', listing_title: 'Beautiful House in Nallur', customer_name: 'Aravinthan', phone: '+94721234567', whatsapp: '+94721234567', email: 'aravind@email.com', message: 'Interested in viewing the property this weekend', source: 'website_form', status: 'interested', priority: 'hot', assigned_to: 'Karthikeyan', notes: 'Serious buyer, willing to negotiate', follow_up_date: '2024-03-25', created_at: '2024-03-22T10:30:00Z' },
  { id: 'INQ002', listing_id: 'L003', listing_title: 'Apartment in Jaffna Town', customer_name: 'Mallika', phone: '+94722345678', whatsapp: '+94722345678', email: 'mallika@email.com', message: 'Is this available for immediate occupancy?', source: 'whatsapp', status: 'new', priority: 'warm', assigned_to: 'Karthikeyan', notes: '', created_at: '2024-03-22T14:15:00Z' },
  { id: 'INQ003', listing_id: 'L004', listing_title: 'Commercial Space in Kokuvil', customer_name: 'Mani K', phone: '+94723456789', whatsapp: '+94723456789', email: 'mani@biz.com', message: 'Looking for office space', source: 'facebook', status: 'contacted', priority: 'warm', assigned_to: 'Shankar', notes: 'Potential long-term tenant', follow_up_date: '2024-03-26', created_at: '2024-03-20T09:00:00Z' },
  { id: 'INQ004', listing_id: 'L005', listing_title: 'Luxury Villa in Nallur', customer_name: 'Chandrasekaran', phone: '+94724567890', whatsapp: '+94724567890', email: 'chandra@email.com', message: 'Interested but need financing', source: 'website_form', status: 'negotiating', priority: 'hot', assigned_to: 'Munisamy', notes: 'Waiting for bank approval', follow_up_date: '2024-03-28', created_at: '2024-03-15T16:45:00Z' },
  { id: 'INQ005', listing_id: 'L001', listing_title: 'Beautiful House in Nallur', customer_name: 'Nayakam', phone: '+94725678901', whatsapp: '+94725678901', email: 'nayakam@email.com', message: 'Want to schedule a site visit', source: 'phone', status: 'site_visit', priority: 'hot', assigned_to: 'Karthikeyan', notes: 'Visited property, seems interested', follow_up_date: '2024-03-25', created_at: '2024-03-18T11:20:00Z' },
  { id: 'INQ006', listing_id: 'L002', listing_title: 'Land Plot in Chunnakam', customer_name: 'Balasubramaniam', phone: '+94726789012', whatsapp: '+94726789012', email: 'bala@email.com', message: 'No response to follow-ups', source: 'google', status: 'no_answer', priority: 'cold', assigned_to: 'Munisamy', notes: 'Called twice, no response', created_at: '2024-03-10T13:30:00Z' },
  { id: 'INQ007', listing_id: 'L004', listing_title: 'Commercial Space in Kokuvil', customer_name: 'Pandaram', phone: '+94727890123', whatsapp: '+94727890123', email: 'pandam@email.com', message: 'Asking for unrealistic price', source: 'website_form', status: 'closed_lost', priority: 'cold', assigned_to: 'Shankar', notes: 'Cannot accommodate price request', created_at: '2024-03-05T10:15:00Z' },
  { id: 'INQ008', listing_id: 'L003', listing_title: 'Apartment in Jaffna Town', customer_name: 'Buy Now Ltd', phone: '+94728901234', whatsapp: '+94728901234', email: 'buynow@test.com', message: 'Buy property quick cash', source: 'website_form', status: 'spam', priority: 'cold', assigned_to: 'System', notes: 'Marked as spam', created_at: '2024-03-22T08:00:00Z' },
];

export const MOCK_REQUIREMENTS: Requirement[] = [
  { id: 'REQ001', customer_name: 'Jayatheeban', phone: '+94729012345', whatsapp: '+94729012345', intent: 'buy', property_type: 'House', preferred_area: 'Nallur', budget_min: 35000000, budget_max: 50000000, bedrooms: 3, urgency: 'high', notes: 'Looking for immediate purchase, near temple', status: 'matched_partial', matches_count: 2, created_at: '2024-03-10T09:30:00Z' },
  { id: 'REQ002', customer_name: 'Nirupa', phone: '+94730123456', whatsapp: '+94730123456', intent: 'rent', property_type: 'Apartment', preferred_area: 'Jaffna Town', budget_min: 50000, budget_max: 80000, bedrooms: 2, urgency: 'medium', notes: 'Family of 3, need modern amenities', status: 'matched_full', matches_count: 1, created_at: '2024-03-15T14:20:00Z' },
  { id: 'REQ003', customer_name: 'Prakash', phone: '+94731234567', whatsapp: '+94731234567', intent: 'buy', property_type: 'Land', preferred_area: 'Chunnakam', budget_min: 8000000, budget_max: 15000000, land_size: '30-50 perches', urgency: 'medium', notes: 'Business development purpose', status: 'in_progress', matches_count: 3, created_at: '2024-03-12T11:00:00Z' },
  { id: 'REQ004', customer_name: 'Anaithu', phone: '+94732345678', whatsapp: '+94732345678', intent: 'rent', property_type: 'Commercial', preferred_area: 'Kokuvil', budget_min: 100000, budget_max: 150000, urgency: 'high', notes: 'Office space for IT company, 2000+ sqft', status: 'matched_partial', matches_count: 1, created_at: '2024-03-18T16:45:00Z' },
  { id: 'REQ005', customer_name: 'Srinivasan', phone: '+94733456789', whatsapp: '+94733456789', intent: 'buy', property_type: 'Villa', preferred_area: 'Nallur', budget_min: 60000000, budget_max: 85000000, bedrooms: 4, urgency: 'medium', notes: 'Premium property with garden', status: 'new', matches_count: 0, created_at: '2024-03-21T10:30:00Z' },
];

export const MOCK_AGENTS: Agent[] = [
  { id: 'A001', name: 'Karthikeyan', company: 'Jaffna Properties Ltd', phone: '+94701234567', whatsapp: '+94701234567', email: 'karthy@jaffnaprops.lk', verified: true, nic_uploaded: true, service_areas: ['Nallur','Jaffna Town','Kopay'], specializations: ['Residential','Family Homes'], active_listings: 12, total_inquiries: 47, response_rate: 92, status: 'active', joined_date: '2023-01-15' },
  { id: 'A002', name: 'Munisamy', company: 'Elite Real Estate', phone: '+94702345678', whatsapp: '+94702345678', email: 'munisamy@eliterealty.lk', verified: true, nic_uploaded: true, service_areas: ['Nallur','Chunnakam','Point Pedro'], specializations: ['Luxury Properties','Land Development'], active_listings: 8, total_inquiries: 34, response_rate: 88, status: 'active', joined_date: '2023-03-22' },
  { id: 'A003', name: 'Shankar', company: 'Kokuvil Commercial Realty', phone: '+94703456789', whatsapp: '+94703456789', email: 'shankar@kcrrealty.lk', verified: false, nic_uploaded: false, service_areas: ['Kokuvil','Jaffna Town'], specializations: ['Commercial','Retail'], active_listings: 6, total_inquiries: 28, response_rate: 75, status: 'pending', joined_date: '2024-02-10' },
  { id: 'A004', name: 'Ravisankaran', company: 'Northern Property Group', phone: '+94704567890', whatsapp: '+94704567890', email: 'ravi@npgroup.lk', verified: true, nic_uploaded: true, service_areas: ['Point Pedro','Karainagar','Thirunelvely'], specializations: ['Residential','Coastal Properties'], active_listings: 15, total_inquiries: 52, response_rate: 95, status: 'active', joined_date: '2022-08-05' },
  { id: 'A005', name: 'Vijayakumar', company: 'Central Jaffna Realty', phone: '+94705678901', whatsapp: '+94705678901', email: 'vijay@centralrealty.lk', verified: true, nic_uploaded: true, service_areas: ['Chavakachcheri','Kopay'], specializations: ['Apartments','Short-term Rentals'], active_listings: 11, total_inquiries: 38, response_rate: 85, status: 'active', joined_date: '2023-06-12' },
  { id: 'A006', name: 'Prabhakaran', company: 'Haven Properties', phone: '+94706789012', whatsapp: '+94706789012', email: 'prabha@havenprops.lk', verified: false, nic_uploaded: true, service_areas: ['Nallur','Jaffna Town'], specializations: ['Affordable Housing'], active_listings: 4, total_inquiries: 15, response_rate: 60, status: 'suspended', joined_date: '2023-11-20' },
  { id: 'A007', name: 'Sundaram', company: 'Sundaram & Co', phone: '+94707890123', whatsapp: '+94707890123', email: 'sundaram@sundco.lk', verified: true, nic_uploaded: true, service_areas: ['Kokuvil','Chunnakam','Chavakachcheri'], specializations: ['Agricultural Land','Commercial'], active_listings: 9, total_inquiries: 31, response_rate: 82, status: 'active', joined_date: '2023-04-08' },
  { id: 'A008', name: 'Abinay', company: 'New Horizons Realty', phone: '+94708901234', whatsapp: '+94708901234', email: 'abinay@newhoriz.lk', verified: false, nic_uploaded: false, service_areas: ['Jaffna Town'], specializations: ['Rental Properties'], active_listings: 3, total_inquiries: 8, response_rate: 70, status: 'pending', joined_date: '2024-01-18' },
];

export const MOCK_USERS: DashboardUser[] = [
  { id: 'U001', name: 'Nanthan', email: 'nanthan77@gmail.com', phone: '+94701111111', role: 'super_admin', status: 'active', last_login: '2024-03-22T14:30:00Z', created_at: '2023-01-01T00:00:00Z' },
  { id: 'U002', name: 'Jayarathnam', email: 'jayarathnam@yaal.lk', phone: '+94702222222', role: 'admin', status: 'active', last_login: '2024-03-22T10:15:00Z', created_at: '2023-06-10T00:00:00Z' },
  { id: 'U003', name: 'Kamala', email: 'kamala@yaal.lk', phone: '+94703333333', role: 'content_manager', status: 'active', last_login: '2024-03-21T09:45:00Z', created_at: '2023-08-15T00:00:00Z' },
  { id: 'U004', name: 'Shankar', email: 'shankar@yaal.lk', phone: '+94704444444', role: 'listing_manager', status: 'active', last_login: '2024-03-20T16:20:00Z', created_at: '2023-09-20T00:00:00Z' },
  { id: 'U005', name: 'Mani', email: 'mani@yaal.lk', phone: '+94705555555', role: 'lead_manager', status: 'active', last_login: '2024-03-19T13:00:00Z', created_at: '2023-10-05T00:00:00Z' },
  { id: 'U006', name: 'Praveen', email: 'praveen@yaal.lk', phone: '+94706666666', role: 'admin', status: 'inactive', last_login: '2024-02-28T11:30:00Z', created_at: '2024-01-12T00:00:00Z' },
];

export const MOCK_AREAS: Area[] = [
  { id: 'AR001', name: 'Jaffna Town', name_ta: 'யாழ்ப்பாணம் நகரம்', slug: 'jaffna-town', district: 'Jaffna', listings_count: 142, featured: true, status: 'active' },
  { id: 'AR002', name: 'Nallur', name_ta: 'நல்லூர்', slug: 'nallur', district: 'Jaffna', listings_count: 156, featured: true, status: 'active' },
  { id: 'AR003', name: 'Chunnakam', name_ta: 'சுண்ணாக்கம்', slug: 'chunnakam', district: 'Jaffna', listings_count: 98, featured: true, status: 'active' },
  { id: 'AR004', name: 'Kokuvil', name_ta: 'கோகுவில்', slug: 'kokuvil', district: 'Jaffna', listings_count: 87, featured: true, status: 'active' },
  { id: 'AR005', name: 'Kopay', name_ta: 'கோபாய்', slug: 'kopay', district: 'Jaffna', listings_count: 76, featured: false, status: 'active' },
  { id: 'AR006', name: 'Point Pedro', name_ta: 'கோட்டையூர்', slug: 'point-pedro', district: 'Jaffna', listings_count: 56, featured: true, status: 'active' },
  { id: 'AR007', name: 'Karainagar', name_ta: 'கராய்நாகர்', slug: 'karainagar', district: 'Jaffna', listings_count: 42, featured: false, status: 'active' },
  { id: 'AR008', name: 'Chavakachcheri', name_ta: 'சவக்கச்சேரி', slug: 'chavakachcheri', district: 'Jaffna', listings_count: 65, featured: false, status: 'active' },
  { id: 'AR009', name: 'Thirunelvely', name_ta: 'திருநெல்வேலி', slug: 'thirunelvely', district: 'Jaffna', listings_count: 34, featured: false, status: 'active' },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  { id: 'BP001', title: 'Guide to Buying Property in Jaffna Peninsula', slug: 'buying-guide-jaffna', category: 'Guides', status: 'published', author: 'Kamala', created_at: '2024-03-15', views: 432 },
  { id: 'BP002', title: 'Nallur Property Market Trends 2024', slug: 'nallur-trends-2024', category: 'Market Analysis', status: 'published', author: 'Jayarathnam', created_at: '2024-03-10', views: 287 },
  { id: 'BP003', title: 'Investment Opportunities in Jaffna', slug: 'investment-opportunities', category: 'Investment', status: 'draft', author: 'Shankar', created_at: '2024-03-20', views: 0 },
  { id: 'BP004', title: 'Understanding Property Valuation', slug: 'property-valuation', category: 'Guides', status: 'published', author: 'Kamala', created_at: '2024-02-28', views: 156 },
  { id: 'BP005', title: 'Rental Market Tips for Landlords', slug: 'rental-tips-landlords', category: 'Guides', status: 'published', author: 'Mani', created_at: '2024-02-15', views: 198 },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'AL001', user: 'Nanthan', action: 'APPROVED_LISTING', target: 'Listing JN-2024-005', details: 'Luxury Villa listing approved', timestamp: '2024-03-22T14:30:00Z' },
  { id: 'AL002', user: 'Kamala', action: 'PUBLISHED_BLOG', target: 'Blog BP002', details: 'Market trends article published', timestamp: '2024-03-22T13:15:00Z' },
  { id: 'AL003', user: 'Jayarathnam', action: 'VERIFIED_AGENT', target: 'Agent A007', details: 'Agent verification docs accepted', timestamp: '2024-03-22T12:00:00Z' },
  { id: 'AL004', user: 'Shankar', action: 'UPDATED_INQUIRY', target: 'Inquiry INQ003', details: 'Marked inquiry as contacted', timestamp: '2024-03-22T11:45:00Z' },
  { id: 'AL005', user: 'Mani', action: 'CREATED_REQUIREMENT', target: 'Requirement REQ005', details: 'New buyer requirement added', timestamp: '2024-03-21T16:20:00Z' },
  { id: 'AL006', user: 'Nanthan', action: 'SUSPENDED_AGENT', target: 'Agent A006', details: 'Agent suspended due to complaint', timestamp: '2024-03-21T10:30:00Z' },
  { id: 'AL007', user: 'Kamala', action: 'DELETED_LISTING', target: 'Listing JN-2024-009', details: 'Duplicate listing removed', timestamp: '2024-03-20T15:45:00Z' },
  { id: 'AL008', user: 'Jayarathnam', action: 'UPDATED_USER_ROLE', target: 'User U002', details: 'Role changed to admin', timestamp: '2024-03-20T09:00:00Z' },
  { id: 'AL009', user: 'Shankar', action: 'FEATURED_LISTING', target: 'Listing JN-2024-004', details: 'Listing featured for 7 days', timestamp: '2024-03-19T14:30:00Z' },
  { id: 'AL010', user: 'Mani', action: 'MATCHED_REQUIREMENT', target: 'Requirement REQ002', details: 'Full match found for buyer', timestamp: '2024-03-19T11:00:00Z' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'N001', title: 'New Inquiry', message: '18 new inquiries received today', type: 'info', read: false, created_at: '2024-03-22T15:00:00Z' },
  { id: 'N002', title: 'Listing Approved', message: 'Luxury Villa listing approved and published', type: 'success', read: false, created_at: '2024-03-22T14:30:00Z' },
  { id: 'N003', title: 'Featured Listing Expiring', message: '3 featured listings expiring in 2 days', type: 'warning', read: true, created_at: '2024-03-22T12:00:00Z' },
  { id: 'N004', title: 'Agent Verification Pending', message: '2 agents awaiting verification review', type: 'info', read: true, created_at: '2024-03-22T10:15:00Z' },
  { id: 'N005', title: 'System Update', message: 'Database backup completed successfully', type: 'success', read: true, created_at: '2024-03-21T23:30:00Z' },
  { id: 'N006', title: 'Listing Rejected', message: 'Listing JN-2024-008 rejected due to missing documents', type: 'danger', read: true, created_at: '2024-03-21T16:45:00Z' },
  { id: 'N007', title: 'High Priority Inquiry', message: 'Hot lead for Luxury Villa - urgent follow-up needed', type: 'danger', read: true, created_at: '2024-03-21T14:00:00Z' },
  { id: 'N008', title: 'Monthly Report Ready', message: 'March performance report is ready for review', type: 'info', read: true, created_at: '2024-03-20T09:00:00Z' },
];
