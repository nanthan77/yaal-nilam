// ========================
// TYPE DEFINITIONS
// ========================

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'archived' | 'draft';
export type InquiryStatus = 'new' | 'contacted' | 'interested' | 'negotiating' | 'site_visit' | 'no_answer' | 'closed_won' | 'closed_lost' | 'spam';
export type RequirementStatus = 'new' | 'in_progress' | 'matched_partial' | 'matched_full' | 'closed';
export type UserRole = 'super_admin' | 'admin' | 'content_manager' | 'listing_manager' | 'lead_manager' | 'viewer';
export type LeadPriority = 'hot' | 'warm' | 'cold';
export type LeadSource = 'website_form' | 'whatsapp' | 'facebook' | 'google' | 'phone' | 'referral' | 'walk_in';
export type MaintenancePriority = 'emergency' | 'urgent' | 'routine';
export type MaintenanceStatus = 'new' | 'assigned' | 'in_progress' | 'completed';
export type FinancialTransactionType = 'rent' | 'deposit' | 'maintenance' | 'commission' | 'promotion';
export type FinancialTransactionStatus = 'paid' | 'pending' | 'overdue' | 'partial';
export type LeaseStatus = 'active' | 'expiring' | 'expired' | 'renewed';

export interface Inquiry {
  id: string;
  listing_id: string;
  listing_title: string;
  customer_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  message: string;
  source: string;
  status: string;
  priority: string;
  assigned_to: string;
  notes: string;
  follow_up_date?: string;
  created_at: string;
}

export interface Requirement {
  id: string;
  customer_name: string;
  phone: string;
  whatsapp: string;
  intent: string;
  property_type: string;
  preferred_area: string;
  budget_min: number;
  budget_max: number;
  bedrooms?: number;
  land_size?: string;
  urgency: string;
  notes: string;
  status: string;
  matches_count: number;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  company: string;
  phone: string;
  whatsapp: string;
  email: string;
  verified: boolean;
  nic_uploaded: boolean;
  service_areas: string[];
  specializations: string[];
  active_listings: number;
  total_inquiries: number;
  response_rate: number;
  status: string;
  joined_date: string;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  last_login: string;
  created_at: string;
}

export interface Area {
  id: string;
  name: string;
  name_ta: string;
  slug: string;
  district: string;
  listings_count: number;
  featured: boolean;
  status: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  author: string;
  created_at: string;
  views: number;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

// ========================
// NEW PROPTECH INTERFACES
// ========================

export interface MaintenanceOrder {
  id: string;
  unit: string;
  property: string;
  issue: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignedVendor: string;
  reportedBy: string;
  reportedDate: string;
  completedDate?: string;
  cost?: number;
}

export interface FinancialTransaction {
  id: string;
  type: FinancialTransactionType;
  amount: number;
  property: string;
  tenant?: string;
  status: FinancialTransactionStatus;
  dueDate: string;
  paidDate?: string;
  method?: string;
}

export interface LeaseInfo {
  id: string;
  tenant: string;
  property: string;
  unit: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: LeaseStatus;
  securityDeposit: number;
}

export interface PortfolioMetric {
  totalUnits: number;
  rentedUnits: number;
  availableUnits: number;
  vacantUnits: number;
  underMaintenanceUnits: number;
  occupancyRate: number;
  noi: number;
  oer: number;
  revenueGrowthMoM: number;
  revenueGrowthYoY: number;
  avgDaysToLease: number;
  renewalRate: number;
  mttr: number;
  rentCollectionRate: number;
  totalOutstanding: number;
  delinquencyRate: number;
}

// ========================
// CONSTANTS
// ========================

export const JAFFNA_AREAS = [
  'Jaffna Town',
  'Jaffna Fort',
  'Nallur',
  'Kopay',
  'Chunnakam',
  'Kokuvil',
  'Point Pedro',
  'Karainagar',
  'Chavakachcheri',
  'Thirunelvely',
  'Manipay',
  'Tellippalai',
  'Vaddukoddai',
];

export const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'Land',
  'Commercial',
  'Office',
  'Warehouse',
];

export const STATUS_COLORS: Record<string, string> = {
  active: '#10b981',
  inactive: '#6b7280',
  pending: '#f59e0b',
  approved: '#3b82f6',
  rejected: '#ef4444',
  draft: '#8b5cf6',
  new: '#3b82f6',
  assigned: '#0ea5e9',
  in_progress: '#f59e0b',
  completed: '#10b981',
  paid: '#10b981',
  overdue: '#ef4444',
  partial: '#f59e0b',
  expired: '#6b7280',
  renewed: '#10b981',
  expiring: '#f59e0b',
  emergency: '#dc2626',
  urgent: '#ea580c',
  routine: '#06b6d4',
};

// ========================
// MOCK DATA
// ========================

// Enhanced Dashboard Statistics with PropTech Metrics
export const DASHBOARD_STATS = {
  activeListings: { value: 623, change: 5.2, trend: "up" },
  pendingApproval: { value: 48, change: 0, trend: "stable", badge: "warning" },
  todayInquiries: { value: 18, change: 12, trend: "up" },
  whatsappLeads: { value: 12, change: 8.5, trend: "up" },
  activeRequirements: { value: 189, change: 3.1, trend: "up" },
  matchesToday: { value: 7, change: 0, trend: "stable" },
  revenueThisMonth: { value: 185000, change: 12.5, trend: "up", currency: "Rs." },
  conversionRate: { value: 8.3, change: 0.5, trend: "up" },
  // PropTech metrics
  totalUnits: { value: 287, change: 2.1, trend: "up" },
  occupancyRate: { value: 89.2, change: 1.5, trend: "up" },
  noi: { value: 4250000, change: 8.3, trend: "up", currency: "Rs." },
  oer: { value: 28.5, change: -1.2, trend: "down" },
  revenueGrowthMoM: { value: 12.5, change: 2.1, trend: "up" },
  revenueGrowthYoY: { value: 34.8, change: 5.2, trend: "up" },
  avgDaysToLease: { value: 18, change: -3, trend: "down" },
  renewalRate: { value: 87.5, change: 2.3, trend: "up" },
  mttr: { value: 4.2, change: -0.8, trend: "down" },
  rentCollectionRate: { value: 95.3, change: 1.2, trend: "up" },
  totalOutstanding: { value: 245000, change: -5.2, trend: "down", currency: "Rs." },
  delinquencyRate: { value: 3.2, change: -0.8, trend: "down" },
};

// Enhanced Mock Listings (12-15 items with more Jaffna areas)
export const MOCK_LISTINGS = [
  {
    id: "list-001",
    title: "Luxury Villa in Jaffna Fort",
    area: "Jaffna Fort",
    price: 45000000,
    type: "Villa",
    status: "pending",
    agent: "கார்த்திகேயன்",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    images: 8,
    missing: [],
  },
  {
    id: "list-002",
    title: "Spacious Apartment - Central Jaffna",
    area: "Jaffna Town",
    price: 18500000,
    type: "Apartment",
    status: "pending",
    agent: "முனிசாமி",
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
    images: 5,
    missing: ["images"],
  },
  {
    id: "list-003",
    title: "Land Plot - Kopay",
    area: "Kopay",
    price: 8500000,
    type: "Land",
    status: "pending",
    agent: "ரவிசங்கரன்",
    date: new Date(Date.now() - 6 * 60 * 60 * 1000),
    images: 2,
    missing: ["images", "price"],
  },
  {
    id: "list-004",
    title: "Commercial Space - Main Street",
    area: "Kokuvil",
    price: 35000000,
    type: "Commercial",
    status: "pending",
    agent: "சங்கர்",
    date: new Date(Date.now() - 8 * 60 * 60 * 1000),
    images: 6,
    missing: [],
  },
  {
    id: "list-005",
    title: "Cottage in Nallur",
    area: "Nallur",
    price: 22500000,
    type: "House",
    status: "pending",
    agent: "கார்த்திகேயன்",
    date: new Date(Date.now() - 10 * 60 * 60 * 1000),
    images: 4,
    missing: ["price"],
  },
  {
    id: "list-006",
    title: "Residential Complex - Chunnakam",
    area: "Chunnakam",
    price: 28000000,
    type: "Apartment",
    status: "approved",
    agent: "முனிசாமி",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    images: 12,
    missing: [],
  },
  {
    id: "list-007",
    title: "Beach Front Property",
    area: "Point Pedro",
    price: 52000000,
    type: "Villa",
    status: "approved",
    agent: "ரவிசங்கரன்",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
    images: 15,
    missing: [],
  },
  {
    id: "list-008",
    title: "Modern Office Space - Karainagar",
    area: "Karainagar",
    price: 32000000,
    type: "Commercial",
    status: "approved",
    agent: "விஜயகுமார்",
    date: new Date(Date.now() - 72 * 60 * 60 * 1000),
    images: 10,
    missing: [],
  },
  {
    id: "list-009",
    title: "Agricultural Land - Chavakachcheri",
    area: "Chavakachcheri",
    price: 5500000,
    type: "Land",
    status: "approved",
    agent: "சுந்தரம்",
    date: new Date(Date.now() - 96 * 60 * 60 * 1000),
    images: 3,
    missing: [],
  },
  {
    id: "list-010",
    title: "Traditional House - Thirunelvely",
    area: "Thirunelvely",
    price: 16800000,
    type: "House",
    status: "draft",
    agent: "பிரபாகரன்",
    date: new Date(Date.now() - 120 * 60 * 60 * 1000),
    images: 7,
    missing: ["price"],
  },
  {
    id: "list-011",
    title: "Twin Villas - Manipay",
    area: "Manipay",
    price: 58000000,
    type: "Villa",
    status: "pending",
    agent: "கார்த்திகேயன்",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000),
    images: 14,
    missing: [],
  },
  {
    id: "list-012",
    title: "Industrial Warehouse - Vaddukoddai",
    area: "Vaddukoddai",
    price: 42000000,
    type: "Commercial",
    status: "approved",
    agent: "சுந்தரம்",
    date: new Date(Date.now() - 144 * 60 * 60 * 1000),
    images: 9,
    missing: [],
  },
  {
    id: "list-013",
    title: "Residential Apartment - Tellippalai",
    area: "Tellippalai",
    price: 19500000,
    type: "Apartment",
    status: "pending",
    agent: "அபினய்",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    images: 6,
    missing: [],
  },
  {
    id: "list-014",
    title: "Premium Land Plot - Jaffna Fort",
    area: "Jaffna Fort",
    price: 12000000,
    type: "Land",
    status: "approved",
    agent: "ரவிசங்கரன்",
    date: new Date(Date.now() - 168 * 60 * 60 * 1000),
    images: 4,
    missing: [],
  },
  {
    id: "list-015",
    title: "Family Home - Kopay",
    area: "Kopay",
    price: 25000000,
    type: "House",
    status: "approved",
    agent: "விஜயகுமார்",
    date: new Date(Date.now() - 192 * 60 * 60 * 1000),
    images: 11,
    missing: [],
  },
];

// Weekly inquiries data for chart
export const INQUIRIES_WEEKLY = [
  { day: "Mon", count: 14 },
  { day: "Tue", count: 18 },
  { day: "Wed", count: 22 },
  { day: "Thu", count: 19 },
  { day: "Fri", count: 25 },
  { day: "Sat", count: 21 },
  { day: "Sun", count: 18 },
];

// Demand vs Supply by area
export const DEMAND_VS_SUPPLY = [
  { area: "Jaffna Fort", demand: 45, supply: 32 },
  { area: "Jaffna Town", demand: 38, supply: 28 },
  { area: "Nallur", demand: 28, supply: 22 },
  { area: "Kopay", demand: 35, supply: 31 },
  { area: "Chunnakam", demand: 18, supply: 25 },
  { area: "Kokuvil", demand: 22, supply: 18 },
];

// Listings by type
export const LISTINGS_BY_TYPE = [
  { type: "Apartment", count: 234, percentage: 37.5 },
  { type: "House", count: 156, percentage: 25.0 },
  { type: "Villa", count: 118, percentage: 18.9 },
  { type: "Land", count: 78, percentage: 12.5 },
  { type: "Commercial", count: 37, percentage: 6.1 },
];

// Top areas by listings
export const TOP_AREAS = [
  { area: "Jaffna Fort", count: 156, percentage: 25.0 },
  { area: "Jaffna Town", count: 132, percentage: 21.2 },
  { area: "Nallur", count: 98, percentage: 15.7 },
  { area: "Kopay", count: 87, percentage: 13.9 },
  { area: "Kokuvil", count: 78, percentage: 12.5 },
  { area: "Chunnakam", count: 72, percentage: 11.5 },
];

// ========================
// NEW CHART DATA ARRAYS
// ========================

// 12 months revenue and expense trend
export const REVENUE_TREND = [
  { month: "Jan", revenue: 2400000, expenses: 680000 },
  { month: "Feb", revenue: 2210000, expenses: 640000 },
  { month: "Mar", revenue: 2290000, expenses: 700000 },
  { month: "Apr", revenue: 2000000, expenses: 620000 },
  { month: "May", revenue: 2181000, expenses: 680000 },
  { month: "Jun", revenue: 2500000, expenses: 750000 },
  { month: "Jul", revenue: 2100000, expenses: 620000 },
  { month: "Aug", revenue: 2200000, expenses: 700000 },
  { month: "Sep", revenue: 2290000, expenses: 680000 },
  { month: "Oct", revenue: 2390000, expenses: 720000 },
  { month: "Nov", revenue: 2490000, expenses: 760000 },
  { month: "Dec", revenue: 2590000, expenses: 800000 },
];

// 6 months occupancy percentage trend
export const OCCUPANCY_TREND = [
  { month: "Jul", occupancy: 82.5 },
  { month: "Aug", occupancy: 84.2 },
  { month: "Sep", occupancy: 86.8 },
  { month: "Oct", occupancy: 87.5 },
  { month: "Nov", occupancy: 88.9 },
  { month: "Dec", occupancy: 89.2 },
];

// Rent collection status breakdown
export const COLLECTION_STATUS = [
  { status: "Paid", count: 245, amount: 3500000 },
  { status: "Pending", count: 32, amount: 450000 },
  { status: "Overdue", count: 8, amount: 125000 },
  { status: "Partial", count: 12, amount: 180000 },
];

// Maintenance orders by priority
export const MAINTENANCE_BY_PRIORITY = [
  { priority: "Emergency", count: 5 },
  { priority: "Urgent", count: 14 },
  { priority: "Routine", count: 28 },
];

// Lease expiry forecast (30/60/90 days)
export const LEASE_EXPIRY_FORECAST = [
  { window: "0-30 days", count: 8 },
  { window: "30-60 days", count: 12 },
  { window: "60-90 days", count: 16 },
];

// Top 5 agent performance
export const AGENT_PERFORMANCE = [
  { agent: "ரவிசங்கரன்", closedDeals: 23, revenue: 580000, responseTime: 2.1, rating: 4.8 },
  { agent: "கார்த்திகேயன்", closedDeals: 19, revenue: 520000, responseTime: 2.4, rating: 4.7 },
  { agent: "முனிசாமி", closedDeals: 16, revenue: 480000, responseTime: 2.8, rating: 4.6 },
  { agent: "விஜயகுமார்", closedDeals: 14, revenue: 420000, responseTime: 3.2, rating: 4.5 },
  { agent: "சுந்தரம்", closedDeals: 12, revenue: 380000, responseTime: 3.5, rating: 4.4 },
];

// Property value trend by quarter
export const PROPERTY_VALUE_TREND = [
  { quarter: "Q1 2023", index: 100 },
  { quarter: "Q2 2023", index: 102.5 },
  { quarter: "Q3 2023", index: 105.2 },
  { quarter: "Q4 2023", index: 108.8 },
  { quarter: "Q1 2024", index: 112.4 },
  { quarter: "Q2 2024", index: 115.9 },
  { quarter: "Q3 2024", index: 118.5 },
  { quarter: "Q4 2024", index: 122.1 },
];

// Sales inquiry funnel
export const INQUIRY_FUNNEL = [
  { stage: "Inquiry", count: 1250 },
  { stage: "Viewing", count: 680 },
  { stage: "Offer", count: 420 },
  { stage: "Negotiation", count: 185 },
  { stage: "Closed", count: 95 },
];

// Monthly collection target vs actual
export const MONTHLY_COLLECTIONS = [
  { month: "Jul", target: 3200000, actual: 3050000 },
  { month: "Aug", target: 3200000, actual: 3120000 },
  { month: "Sep", target: 3400000, actual: 3280000 },
  { month: "Oct", target: 3400000, actual: 3380000 },
  { month: "Nov", target: 3600000, actual: 3520000 },
  { month: "Dec", target: 3600000, actual: 3500000 },
];

// ========================
// MOCK INQUIRIES
// ========================

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ001',
    listing_id: 'L001',
    listing_title: 'Luxury Villa in Jaffna Fort',
    customer_name: 'அரவிந்தன்',
    phone: '+94721234567',
    whatsapp: '+94721234567',
    email: 'aravind@email.com',
    message: 'Interested in viewing the property this weekend',
    source: 'website_form',
    status: 'interested',
    priority: 'hot',
    assigned_to: 'கார்த்திகேயன்',
    notes: 'Serious buyer, willing to negotiate',
    follow_up_date: '2024-03-25',
    created_at: '2024-03-22T10:30:00Z',
  },
  {
    id: 'INQ002',
    listing_id: 'L003',
    listing_title: 'Land Plot - Kopay',
    customer_name: 'மல்லிகா',
    phone: '+94722345678',
    whatsapp: '+94722345678',
    email: 'mallika@email.com',
    message: 'Is this available for immediate occupancy?',
    source: 'whatsapp',
    status: 'new',
    priority: 'warm',
    assigned_to: 'கார்த்திகேயன்',
    notes: '',
    created_at: '2024-03-22T14:15:00Z',
  },
  {
    id: 'INQ003',
    listing_id: 'L004',
    listing_title: 'Commercial Space - Main Street',
    customer_name: 'மணி குமாரசாமி',
    phone: '+94723456789',
    whatsapp: '+94723456789',
    email: 'mani@biz.com',
    message: 'Looking for office space, can you provide more details?',
    source: 'facebook',
    status: 'contacted',
    priority: 'warm',
    assigned_to: 'சங்கர்',
    notes: 'Potential long-term tenant',
    follow_up_date: '2024-03-26',
    created_at: '2024-03-20T09:00:00Z',
  },
  {
    id: 'INQ004',
    listing_id: 'L005',
    listing_title: 'Cottage in Nallur',
    customer_name: 'சந்திரசேகரன்',
    phone: '+94724567890',
    whatsapp: '+94724567890',
    email: 'chandra@email.com',
    message: 'Interested but need financing arrangement',
    source: 'website_form',
    status: 'negotiating',
    priority: 'hot',
    assigned_to: 'முனிசாமி',
    notes: 'Waiting for bank approval',
    follow_up_date: '2024-03-28',
    created_at: '2024-03-15T16:45:00Z',
  },
  {
    id: 'INQ005',
    listing_id: 'L001',
    listing_title: 'Luxury Villa in Jaffna Fort',
    customer_name: 'நாயகம்',
    phone: '+94725678901',
    whatsapp: '+94725678901',
    email: 'nayakam@email.com',
    message: 'Want to schedule a site visit',
    source: 'phone',
    status: 'site_visit',
    priority: 'hot',
    assigned_to: 'கார்த்திகேயன்',
    notes: 'Visited property on 2024-03-21, seems interested',
    follow_up_date: '2024-03-25',
    created_at: '2024-03-18T11:20:00Z',
  },
  {
    id: 'INQ006',
    listing_id: 'L002',
    listing_title: 'Spacious Apartment - Central Jaffna',
    customer_name: 'பாலசுப்பிரமணியம்',
    phone: '+94726789012',
    whatsapp: '+94726789012',
    email: 'bala@email.com',
    message: 'No response to follow-ups',
    source: 'google',
    status: 'no_answer',
    priority: 'cold',
    assigned_to: 'முனிசாமி',
    notes: 'Called twice, no response',
    created_at: '2024-03-10T13:30:00Z',
  },
  {
    id: 'INQ007',
    listing_id: 'L004',
    listing_title: 'Commercial Space - Main Street',
    customer_name: 'பந்தாரம்',
    phone: '+94727890123',
    whatsapp: '+94727890123',
    email: 'pandam@email.com',
    message: 'Asking for unrealistic price reduction',
    source: 'website_form',
    status: 'closed_lost',
    priority: 'cold',
    assigned_to: 'சங்கர்',
    notes: 'Cannot accommodate price request',
    created_at: '2024-03-05T10:15:00Z',
  },
  {
    id: 'INQ008',
    listing_id: 'L003',
    listing_title: 'Land Plot - Kopay',
    customer_name: 'Buy Now Ltd',
    phone: '+94728901234',
    whatsapp: '+94728901234',
    email: 'buynow@test.com',
    message: 'Buy property quick cash',
    source: 'website_form',
    status: 'spam',
    priority: 'cold',
    assigned_to: 'System',
    notes: 'Marked as spam, suspicious buyer',
    created_at: '2024-03-22T08:00:00Z',
  },
];

// ========================
// MOCK REQUIREMENTS
// ========================

export const MOCK_REQUIREMENTS: Requirement[] = [
  {
    id: 'REQ001',
    customer_name: 'ஜயதீபன்',
    phone: '+94729012345',
    whatsapp: '+94729012345',
    intent: 'buy',
    property_type: 'House',
    preferred_area: 'Nallur',
    budget_min: 35000000,
    budget_max: 50000000,
    bedrooms: 3,
    urgency: 'high',
    notes: 'Looking for immediate purchase, near temple',
    status: 'matched_partial',
    matches_count: 2,
    created_at: '2024-03-10T09:30:00Z',
  },
  {
    id: 'REQ002',
    customer_name: 'நிருபா',
    phone: '+94730123456',
    whatsapp: '+94730123456',
    intent: 'rent',
    property_type: 'Apartment',
    preferred_area: 'Jaffna Town',
    budget_min: 50000,
    budget_max: 80000,
    bedrooms: 2,
    urgency: 'medium',
    notes: 'Family of 3, need modern amenities',
    status: 'matched_full',
    matches_count: 1,
    created_at: '2024-03-15T14:20:00Z',
  },
  {
    id: 'REQ003',
    customer_name: 'ப்ரகாஷ் பட்டஸ்',
    phone: '+94731234567',
    whatsapp: '+94731234567',
    intent: 'buy',
    property_type: 'Land',
    preferred_area: 'Chunnakam',
    budget_min: 8000000,
    budget_max: 15000000,
    land_size: '30-50 perches',
    urgency: 'medium',
    notes: 'Business development purpose',
    status: 'in_progress',
    matches_count: 3,
    created_at: '2024-03-12T11:00:00Z',
  },
  {
    id: 'REQ004',
    customer_name: 'அனாய்தூ',
    phone: '+94732345678',
    whatsapp: '+94732345678',
    intent: 'rent',
    property_type: 'Commercial',
    preferred_area: 'Kokuvil',
    budget_min: 100000,
    budget_max: 150000,
    urgency: 'high',
    notes: 'Office space for IT company, 2000+ sqft',
    status: 'matched_partial',
    matches_count: 1,
    created_at: '2024-03-18T16:45:00Z',
  },
  {
    id: 'REQ005',
    customer_name: 'சீனிவாசன்',
    phone: '+94733456789',
    whatsapp: '+94733456789',
    intent: 'buy',
    property_type: 'Villa',
    preferred_area: 'Nallur',
    budget_min: 60000000,
    budget_max: 85000000,
    bedrooms: 4,
    urgency: 'medium',
    notes: 'Premium property with garden',
    status: 'new',
    matches_count: 0,
    created_at: '2024-03-21T10:30:00Z',
  },
];

// ========================
// MOCK AGENTS
// ========================

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'A001',
    name: 'கார்த்திகேயன்',
    company: 'Jaffna Properties Ltd',
    phone: '+94701234567',
    whatsapp: '+94701234567',
    email: 'karthy@jaffnaprops.lk',
    verified: true,
    nic_uploaded: true,
    service_areas: ['Nallur', 'Jaffna Town', 'Kopay'],
    specializations: ['Residential', 'Family Homes'],
    active_listings: 12,
    total_inquiries: 47,
    response_rate: 92,
    status: 'active',
    joined_date: '2023-01-15',
  },
  {
    id: 'A002',
    name: 'முனிசாமி',
    company: 'Elite Real Estate',
    phone: '+94702345678',
    whatsapp: '+94702345678',
    email: 'munisamy@eliterealty.lk',
    verified: true,
    nic_uploaded: true,
    service_areas: ['Nallur', 'Chunnakam', 'Point Pedro'],
    specializations: ['Luxury Properties', 'Land Development'],
    active_listings: 8,
    total_inquiries: 34,
    response_rate: 88,
    status: 'active',
    joined_date: '2023-03-22',
  },
  {
    id: 'A003',
    name: 'சங்கர்',
    company: 'Kokuvil Commercial Realty',
    phone: '+94703456789',
    whatsapp: '+94703456789',
    email: 'shankar@kcrrealty.lk',
    verified: false,
    nic_uploaded: false,
    service_areas: ['Kokuvil', 'Jaffna Town'],
    specializations: ['Commercial', 'Retail'],
    active_listings: 6,
    total_inquiries: 28,
    response_rate: 75,
    status: 'pending',
    joined_date: '2024-02-10',
  },
  {
    id: 'A004',
    name: 'ரவிசங்கரன்',
    company: 'Northern Property Group',
    phone: '+94704567890',
    whatsapp: '+94704567890',
    email: 'ravi@npgroup.lk',
    verified: true,
    nic_uploaded: true,
    service_areas: ['Point Pedro', 'Karainagar', 'Thirunelvely'],
    specializations: ['Residential', 'Coastal Properties'],
    active_listings: 15,
    total_inquiries: 52,
    response_rate: 95,
    status: 'active',
    joined_date: '2022-08-05',
  },
  {
    id: 'A005',
    name: 'விஜயகுமார்',
    company: 'Central Jaffna Realty',
    phone: '+94705678901',
    whatsapp: '+94705678901',
    email: 'vijay@centralrealty.lk',
    verified: true,
    nic_uploaded: true,
    service_areas: ['Chavakachcheri', 'Kopay'],
    specializations: ['Apartments', 'Short-term Rentals'],
    active_listings: 11,
    total_inquiries: 38,
    response_rate: 85,
    status: 'active',
    joined_date: '2023-06-12',
  },
  {
    id: 'A006',
    name: 'பிரபாகரன்',
    company: 'Haven Properties',
    phone: '+94706789012',
    whatsapp: '+94706789012',
    email: 'prabha@havenprops.lk',
    verified: false,
    nic_uploaded: true,
    service_areas: ['Nallur', 'Jaffna Town'],
    specializations: ['Affordable Housing'],
    active_listings: 4,
    total_inquiries: 15,
    response_rate: 60,
    status: 'suspended',
    joined_date: '2023-11-20',
  },
  {
    id: 'A007',
    name: 'சுந்தரம்',
    company: 'Sundaram & Co',
    phone: '+94707890123',
    whatsapp: '+94707890123',
    email: 'sundaram@sundco.lk',
    verified: true,
    nic_uploaded: true,
    service_areas: ['Kokuvil', 'Chunnakam', 'Chavakachcheri'],
    specializations: ['Agricultural Land', 'Commercial'],
    active_listings: 9,
    total_inquiries: 31,
    response_rate: 82,
    status: 'active',
    joined_date: '2023-04-08',
  },
  {
    id: 'A008',
    name: 'அபினய்',
    company: 'New Horizons Realty',
    phone: '+94708901234',
    whatsapp: '+94708901234',
    email: 'abinay@newhoriz.lk',
    verified: false,
    nic_uploaded: false,
    service_areas: ['Jaffna Town'],
    specializations: ['Rental Properties'],
    active_listings: 3,
    total_inquiries: 8,
    response_rate: 70,
    status: 'pending',
    joined_date: '2024-01-18',
  },
];

// ========================
// MOCK USERS
// ========================

export const MOCK_USERS: DashboardUser[] = [
  {
    id: 'U001',
    name: 'Nanthan',
    email: 'nanthan77@gmail.com',
    phone: '+94701111111',
    role: 'super_admin',
    status: 'active',
    last_login: '2024-03-22T14:30:00Z',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'U002',
    name: 'ஜயரத்தினம்',
    email: 'jayarathnam@yaal.lk',
    phone: '+94702222222',
    role: 'admin',
    status: 'active',
    last_login: '2024-03-22T10:15:00Z',
    created_at: '2023-06-10T00:00:00Z',
  },
  {
    id: 'U003',
    name: 'கமலா',
    email: 'kamala@yaal.lk',
    phone: '+94703333333',
    role: 'content_manager',
    status: 'active',
    last_login: '2024-03-21T09:45:00Z',
    created_at: '2023-08-15T00:00:00Z',
  },
  {
    id: 'U004',
    name: 'சங்கர்',
    email: 'shankar@yaal.lk',
    phone: '+94704444444',
    role: 'listing_manager',
    status: 'active',
    last_login: '2024-03-20T16:20:00Z',
    created_at: '2023-09-20T00:00:00Z',
  },
  {
    id: 'U005',
    name: 'மணி',
    email: 'mani@yaal.lk',
    phone: '+94705555555',
    role: 'lead_manager',
    status: 'active',
    last_login: '2024-03-19T13:00:00Z',
    created_at: '2023-10-05T00:00:00Z',
  },
  {
    id: 'U006',
    name: 'பிரவீன்',
    email: 'praveen@yaal.lk',
    phone: '+94706666666',
    role: 'admin',
    status: 'inactive',
    last_login: '2024-02-28T11:30:00Z',
    created_at: '2024-01-12T00:00:00Z',
  },
];

// ========================
// MOCK AREAS
// ========================

export const MOCK_AREAS: Area[] = [
  {
    id: 'AR001',
    name: 'Jaffna Town',
    name_ta: 'யாழ்ப்பாணம் நகரம்',
    slug: 'jaffna-town',
    district: 'Jaffna',
    listings_count: 142,
    featured: true,
    status: 'active',
  },
  {
    id: 'AR002',
    name: 'Nallur',
    name_ta: 'நல்லூர்',
    slug: 'nallur',
    district: 'Jaffna',
    listings_count: 156,
    featured: true,
    status: 'active',
  },
  {
    id: 'AR003',
    name: 'Chunnakam',
    name_ta: 'சுண்ணாக்கம்',
    slug: 'chunnakam',
    district: 'Jaffna',
    listings_count: 98,
    featured: true,
    status: 'active',
  },
  {
    id: 'AR004',
    name: 'Kokuvil',
    name_ta: 'கோகுவிள்',
    slug: 'kokuvil',
    district: 'Jaffna',
    listings_count: 87,
    featured: true,
    status: 'active',
  },
  {
    id: 'AR005',
    name: 'Kopay',
    name_ta: 'கோபாய்',
    slug: 'kopay',
    district: 'Jaffna',
    listings_count: 76,
    featured: false,
    status: 'active',
  },
  {
    id: 'AR006',
    name: 'Point Pedro',
    name_ta: 'கோட்டையூர்',
    slug: 'point-pedro',
    district: 'Jaffna',
    listings_count: 56,
    featured: true,
    status: 'active',
  },
  {
    id: 'AR007',
    name: 'Karainagar',
    name_ta: 'கராய்நாகர்',
    slug: 'karainagar',
    district: 'Jaffna',
    listings_count: 42,
    featured: false,
    status: 'active',
  },
  {
    id: 'AR008',
    name: 'Chavakachcheri',
    name_ta: 'சவக்கச்சேரி',
    slug: 'chavakachcheri',
    district: 'Jaffna',
    listings_count: 65,
    featured: false,
    status: 'active',
  },
  {
    id: 'AR009',
    name: 'Thirunelvely',
    name_ta: 'திருநெல்வேலி',
    slug: 'thirunelvely',
    district: 'Jaffna',
    listings_count: 34,
    featured: false,
    status: 'active',
  },
];

// ========================
// MOCK BLOG POSTS
// ========================

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'BP001',
    title: 'Guide to Buying Property in Jaffna Peninsula',
    slug: 'buying-guide-jaffna',
    category: 'Guides',
    status: 'published',
    author: 'கமலா',
    created_at: '2024-03-15',
    views: 432,
  },
  {
    id: 'BP002',
    title: 'Nallur Property Market Trends 2024',
    slug: 'nallur-trends-2024',
    category: 'Market Analysis',
    status: 'published',
    author: 'ஜயரத்தினம்',
    created_at: '2024-03-10',
    views: 287,
  },
  {
    id: 'BP003',
    title: 'Investment Opportunities in Jaffna',
    slug: 'investment-opportunities',
    category: 'Investment',
    status: 'draft',
    author: 'சங்கர்',
    created_at: '2024-03-20',
    views: 0,
  },
  {
    id: 'BP004',
    title: 'Understanding Property Valuation',
    slug: 'property-valuation',
    category: 'Guides',
    status: 'published',
    author: 'கமலா',
    created_at: '2024-02-28',
    views: 156,
  },
  {
    id: 'BP005',
    title: 'Rental Market Tips for Landlords',
    slug: 'rental-tips-landlords',
    category: 'Guides',
    status: 'published',
    author: 'மணி',
    created_at: '2024-02-15',
    views: 198,
  },
];

// ========================
// MOCK AUDIT LOGS
// ========================

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AL001',
    user: 'Nanthan',
    action: 'APPROVED_LISTING',
    target: 'Listing JN-2024-005',
    details: 'Luxury Villa listing approved for publication',
    timestamp: '2024-03-22T14:30:00Z',
  },
  {
    id: 'AL002',
    user: 'கமலா',
    action: 'PUBLISHED_BLOG',
    target: 'Blog BP002',
    details: 'Market trends article published',
    timestamp: '2024-03-22T13:15:00Z',
  },
  {
    id: 'AL003',
    user: 'ஜயரத்தினம்',
    action: 'VERIFIED_AGENT',
    target: 'Agent A007',
    details: 'Agent verification documents accepted',
    timestamp: '2024-03-22T12:00:00Z',
  },
  {
    id: 'AL004',
    user: 'சங்கர்',
    action: 'UPDATED_INQUIRY',
    target: 'Inquiry INQ003',
    details: 'Marked inquiry as contacted',
    timestamp: '2024-03-22T11:45:00Z',
  },
  {
    id: 'AL005',
    user: 'மணி',
    action: 'CREATED_REQUIREMENT',
    target: 'Requirement REQ005',
    details: 'New buyer requirement added',
    timestamp: '2024-03-21T16:20:00Z',
  },
  {
    id: 'AL006',
    user: 'Nanthan',
    action: 'SUSPENDED_AGENT',
    target: 'Agent A006',
    details: 'Agent suspended due to complaint',
    timestamp: '2024-03-21T10:30:00Z',
  },
  {
    id: 'AL007',
    user: 'கமலா',
    action: 'DELETED_LISTING',
    target: 'Listing JN-2024-009',
    details: 'Duplicate listing removed',
    timestamp: '2024-03-20T15:45:00Z',
  },
  {
    id: 'AL008',
    user: 'ஜயரத்தினம்',
    action: 'UPDATED_USER_ROLE',
    target: 'User U002',
    details: 'Role changed from listing_manager to admin',
    timestamp: '2024-03-20T09:00:00Z',
  },
  {
    id: 'AL009',
    user: 'சங்கர்',
    action: 'FEATURED_LISTING',
    target: 'Listing JN-2024-004',
    details: 'Listing featured for 7 days',
    timestamp: '2024-03-19T14:30:00Z',
  },
  {
    id: 'AL010',
    user: 'மணி',
    action: 'MATCHED_REQUIREMENT',
    target: 'Requirement REQ002',
    details: 'Full match found for buyer requirement',
    timestamp: '2024-03-19T11:00:00Z',
  },
];

// ========================
// MOCK NOTIFICATIONS
// ========================

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'N001',
    title: 'New Inquiry',
    message: '18 new inquiries received today',
    type: 'info',
    read: false,
    created_at: '2024-03-22T15:00:00Z',
  },
  {
    id: 'N002',
    title: 'Listing Approved',
    message: 'Luxury Villa listing approved and published',
    type: 'success',
    read: false,
    created_at: '2024-03-22T14:30:00Z',
  },
  {
    id: 'N003',
    title: 'Featured Listing Expiring',
    message: '3 featured listings expiring in 2 days',
    type: 'warning',
    read: true,
    created_at: '2024-03-22T12:00:00Z',
  },
  {
    id: 'N004',
    title: 'Agent Verification Pending',
    message: '2 agents awaiting verification review',
    type: 'info',
    read: true,
    created_at: '2024-03-22T10:15:00Z',
  },
  {
    id: 'N005',
    title: 'System Update',
    message: 'Database backup completed successfully',
    type: 'success',
    read: true,
    created_at: '2024-03-21T23:30:00Z',
  },
  {
    id: 'N006',
    title: 'Listing Rejected',
    message: 'Listing JN-2024-008 rejected due to missing documents',
    type: 'danger',
    read: true,
    created_at: '2024-03-21T16:45:00Z',
  },
  {
    id: 'N007',
    title: 'High Priority Inquiry',
    message: 'Hot lead received for Luxury Villa - urgent follow-up needed',
    type: 'danger',
    read: true,
    created_at: '2024-03-21T14:00:00Z',
  },
  {
    id: 'N008',
    title: 'Monthly Report Ready',
    message: 'March performance report is ready for review',
    type: 'info',
    read: true,
    created_at: '2024-03-20T09:00:00Z',
  },
];

// ========================
// MOCK MAINTENANCE ORDERS
// ========================

export const MOCK_MAINTENANCE_ORDERS: MaintenanceOrder[] = [
  {
    id: 'MO001',
    unit: 'Unit 101',
    property: 'Residential Complex - Chunnakam',
    issue: 'Roof leak in master bedroom',
    priority: 'emergency',
    status: 'assigned',
    assignedVendor: 'Jaffna Roofing Solutions',
    reportedBy: 'கார்த்திகேயன்',
    reportedDate: '2024-03-22T10:30:00Z',
    cost: 45000,
  },
  {
    id: 'MO002',
    unit: 'Unit 203',
    property: 'Modern Office Space - Karainagar',
    issue: 'Air conditioning system malfunction',
    priority: 'urgent',
    status: 'in_progress',
    assignedVendor: 'Cool Comfort HVAC',
    reportedBy: 'முனிசாமி',
    reportedDate: '2024-03-21T14:00:00Z',
    cost: 28000,
  },
  {
    id: 'MO003',
    unit: 'Unit 305',
    property: 'Luxury Villa in Jaffna Fort',
    issue: 'Plumbing issue - water pressure low',
    priority: 'routine',
    status: 'new',
    assignedVendor: 'Northern Plumbing Services',
    reportedBy: 'சங்கர்',
    reportedDate: '2024-03-22T11:15:00Z',
  },
  {
    id: 'MO004',
    unit: 'Unit 412',
    property: 'Spacious Apartment - Central Jaffna',
    issue: 'Electrical outlet not working in kitchen',
    priority: 'urgent',
    status: 'assigned',
    assignedVendor: 'Jaffna Electric Works',
    reportedBy: 'ரவிசங்கரன்',
    reportedDate: '2024-03-20T09:45:00Z',
    cost: 8500,
  },
  {
    id: 'MO005',
    unit: 'Common Area',
    property: 'Residential Complex - Chunnakam',
    issue: 'Lobby lights flickering',
    priority: 'routine',
    status: 'completed',
    assignedVendor: 'Jaffna Electric Works',
    reportedBy: 'விஜயகுமார்',
    reportedDate: '2024-03-15T16:20:00Z',
    completedDate: '2024-03-18T14:30:00Z',
    cost: 3500,
  },
  {
    id: 'MO006',
    unit: 'Unit 108',
    property: 'Beach Front Property',
    issue: 'Window frame rust and corrosion',
    priority: 'routine',
    status: 'in_progress',
    assignedVendor: 'Coast Guard Metal Works',
    reportedBy: 'அபினய்',
    reportedDate: '2024-03-19T13:00:00Z',
    cost: 12500,
  },
  {
    id: 'MO007',
    unit: 'Unit 201',
    property: 'Commercial Space - Main Street',
    issue: 'Door locking mechanism broken',
    priority: 'emergency',
    status: 'assigned',
    assignedVendor: 'Jaffna Lock & Hardware',
    reportedBy: 'சுந்தரம்',
    reportedDate: '2024-03-22T08:30:00Z',
    cost: 18000,
  },
  {
    id: 'MO008',
    unit: 'Unit 505',
    property: 'Twin Villas - Manipay',
    issue: 'Garden fence damaged',
    priority: 'routine',
    status: 'completed',
    assignedVendor: 'Green Spaces Maintenance',
    reportedBy: 'பிரபாகரன்',
    reportedDate: '2024-03-10T10:00:00Z',
    completedDate: '2024-03-16T15:45:00Z',
    cost: 22000,
  },
  {
    id: 'MO009',
    unit: 'Unit 602',
    property: 'Modern Office Space - Karainagar',
    issue: 'Carpet staining and cleaning required',
    priority: 'routine',
    status: 'new',
    assignedVendor: 'Professional Carpet Cleaning',
    reportedBy: 'மணி',
    reportedDate: '2024-03-22T12:00:00Z',
  },
  {
    id: 'MO010',
    unit: 'Parking Area',
    property: 'Residential Complex - Chunnakam',
    issue: 'Pothole in parking lot',
    priority: 'urgent',
    status: 'assigned',
    assignedVendor: 'Jaffna Road Works',
    reportedBy: 'ஜயரத்தினம்',
    reportedDate: '2024-03-21T11:30:00Z',
    cost: 35000,
  },
];

// ========================
// MOCK FINANCIAL TRANSACTIONS
// ========================

export const MOCK_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'FT001',
    type: 'rent',
    amount: 65000,
    property: 'Residential Complex - Chunnakam',
    tenant: 'அரவிந்தன் பரிவாருম்',
    status: 'paid',
    dueDate: '2024-03-01',
    paidDate: '2024-03-01',
    method: 'Bank Transfer',
  },
  {
    id: 'FT002',
    type: 'rent',
    amount: 75000,
    property: 'Modern Office Space - Karainagar',
    tenant: 'சேவா பிசினேஸ் சলিউশன்ஸ்',
    status: 'pending',
    dueDate: '2024-03-01',
    method: 'Bank Transfer',
  },
  {
    id: 'FT003',
    type: 'deposit',
    amount: 150000,
    property: 'Beach Front Property',
    tenant: 'மல்லிகா குமாரசாமி',
    status: 'paid',
    dueDate: '2024-03-15',
    paidDate: '2024-03-15',
    method: 'Cheque',
  },
  {
    id: 'FT004',
    type: 'rent',
    amount: 55000,
    property: 'Luxury Villa in Jaffna Fort',
    tenant: 'சந்திரசேகரன் பரிவார்',
    status: 'overdue',
    dueDate: '2024-02-01',
    method: 'Bank Transfer',
  },
  {
    id: 'FT005',
    type: 'maintenance',
    amount: 45000,
    property: 'Residential Complex - Chunnakam',
    status: 'paid',
    dueDate: '2024-03-22',
    paidDate: '2024-03-22',
    method: 'Bank Transfer',
  },
  {
    id: 'FT006',
    type: 'rent',
    amount: 68000,
    property: 'Spacious Apartment - Central Jaffna',
    tenant: 'நாயகம் குடும்பம்',
    status: 'partial',
    dueDate: '2024-03-01',
    paidDate: '2024-03-10',
    method: 'Cash',
  },
  {
    id: 'FT007',
    type: 'commission',
    amount: 125000,
    property: 'Commercial Space - Main Street',
    status: 'paid',
    dueDate: '2024-03-20',
    paidDate: '2024-03-20',
    method: 'Bank Transfer',
  },
  {
    id: 'FT008',
    type: 'rent',
    amount: 82000,
    property: 'Twin Villas - Manipay',
    tenant: 'பந்தாரம் குடும்பம்',
    status: 'pending',
    dueDate: '2024-03-01',
    method: 'Bank Transfer',
  },
  {
    id: 'FT009',
    type: 'promotion',
    amount: 20000,
    property: 'Family Home - Kopay',
    status: 'paid',
    dueDate: '2024-03-15',
    paidDate: '2024-03-15',
    method: 'Bank Transfer',
  },
  {
    id: 'FT010',
    type: 'maintenance',
    amount: 28000,
    property: 'Modern Office Space - Karainagar',
    status: 'pending',
    dueDate: '2024-03-25',
    method: 'Cheque',
  },
  {
    id: 'FT011',
    type: 'deposit',
    amount: 120000,
    property: 'Cottage in Nallur',
    tenant: 'புவனேஸ்வரன்',
    status: 'paid',
    dueDate: '2024-03-10',
    paidDate: '2024-03-10',
    method: 'Bank Transfer',
  },
  {
    id: 'FT012',
    type: 'rent',
    amount: 72000,
    property: 'Industrial Warehouse - Vaddukoddai',
    tenant: 'சதுரங்கன் பிசினேஸ்',
    status: 'paid',
    dueDate: '2024-03-05',
    paidDate: '2024-03-05',
    method: 'Bank Transfer',
  },
];

// ========================
// MOCK LEASES
// ========================

export const MOCK_LEASES: LeaseInfo[] = [
  {
    id: 'LS001',
    tenant: 'அரவிந்தன் பரிவாருम்',
    property: 'Residential Complex - Chunnakam',
    unit: 'Unit 101',
    startDate: '2023-06-01',
    endDate: '2025-05-31',
    monthlyRent: 65000,
    status: 'active',
    securityDeposit: 195000,
  },
  {
    id: 'LS002',
    tenant: 'சேவா பிசினேஸ் சலிউशнѕ்',
    property: 'Modern Office Space - Karainagar',
    unit: 'Unit 203',
    startDate: '2023-01-15',
    endDate: '2024-01-14',
    monthlyRent: 75000,
    status: 'expired',
    securityDeposit: 225000,
  },
  {
    id: 'LS003',
    tenant: 'மல்லிகா குமாரசாமி',
    property: 'Beach Front Property',
    unit: 'Unit 305',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyRent: 125000,
    status: 'active',
    securityDeposit: 375000,
  },
  {
    id: 'LS004',
    tenant: 'சந்திரசேகரன் பரிவார்',
    property: 'Luxury Villa in Jaffna Fort',
    unit: 'Unit 412',
    startDate: '2023-03-01',
    endDate: '2024-04-30',
    monthlyRent: 55000,
    status: 'expiring',
    securityDeposit: 165000,
  },
  {
    id: 'LS005',
    tenant: 'நாயகம் குடும்பம்',
    property: 'Spacious Apartment - Central Jaffna',
    unit: 'Unit 108',
    startDate: '2022-12-01',
    endDate: '2024-03-31',
    monthlyRent: 68000,
    status: 'renewed',
    securityDeposit: 204000,
  },
  {
    id: 'LS006',
    tenant: 'பந்தாரம் குடும்பம்',
    property: 'Twin Villas - Manipay',
    unit: 'Unit 505',
    startDate: '2024-02-01',
    endDate: '2026-01-31',
    monthlyRent: 82000,
    status: 'active',
    securityDeposit: 246000,
  },
  {
    id: 'LS007',
    tenant: 'புவனேஸ்வரன்',
    property: 'Cottage in Nallur',
    unit: 'Unit 602',
    startDate: '2023-09-15',
    endDate: '2024-09-14',
    monthlyRent: 48000,
    status: 'expiring',
    securityDeposit: 144000,
  },
  {
    id: 'LS008',
    tenant: 'சதுரங்கன் பிசினேஸ்',
    property: 'Industrial Warehouse - Vaddukoddai',
    unit: 'Warehouse A',
    startDate: '2023-05-01',
    endDate: '2025-04-30',
    monthlyRent: 72000,
    status: 'active',
    securityDeposit: 216000,
  },
  {
    id: 'LS009',
    tenant: 'விஜயா குடும்பம்',
    property: 'Residential Apartment - Tellippalai',
    unit: 'Unit 201',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyRent: 52000,
    status: 'active',
    securityDeposit: 156000,
  },
  {
    id: 'LS010',
    tenant: 'கடல் சகோதரன்',
    property: 'Family Home - Kopay',
    unit: 'Villa B',
    startDate: '2021-11-01',
    endDate: '2024-10-31',
    monthlyRent: 62000,
    status: 'expired',
    securityDeposit: 186000,
  },
];
