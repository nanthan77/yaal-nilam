// Shared types for Yaal Nilam — used by both dashboard and web

// ============ ENUMS / UNIONS ============
export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Land' | 'Commercial';
export type PropertyStatus = 'available' | 'sold' | 'pending' | 'rented' | 'draft';
export type ListingStatus = 'active' | 'pending_review' | 'rejected' | 'expired' | 'sold' | 'rented' | 'draft';
export type InquiryStatus = 'new' | 'contacted' | 'interested' | 'site_visit' | 'negotiating' | 'closed_won' | 'closed_lost' | 'no_answer' | 'spam';
export type InquiryPriority = 'hot' | 'warm' | 'cold';
export type LeadSource = 'website_form' | 'whatsapp' | 'facebook' | 'google' | 'phone' | 'referral' | 'walk_in';
export type RequirementStatus = 'new' | 'in_progress' | 'matched_partial' | 'matched_full' | 'closed';
export type AgentStatus = 'active' | 'pending' | 'suspended';
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'agent';
export type WhatsAppMessageDirection = 'inbound' | 'outbound';
export type WhatsAppMessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type WhatsAppConversationStatus = 'active' | 'resolved' | 'archived';

// ============ INTERFACES ============

export interface Listing {
  id: string;
  title: string;
  title_ta: string;
  description: string;
  description_ta: string;
  type: PropertyType;
  status: ListingStatus;
  price: number;
  currency: string; // LKR
  area_slug: string;
  area_name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  land_size_perches?: number;
  images: string[];
  featured: boolean;
  agent_id: string;
  agent_name: string;
  whatsapp_clicks: number;
  views: number;
  inquiries_count: number;
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface Area {
  id: string;
  slug: string;
  name: string;
  name_ta: string;
  description: string;
  description_ta: string;
  image: string;
  properties_count: number;
  avg_price: number;
  popular: boolean;
}

export interface Inquiry {
  id: string;
  listing_id: string;
  listing_title: string;
  customer_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  message: string;
  source: LeadSource;
  status: InquiryStatus;
  priority: InquiryPriority;
  assigned_to: string;
  notes: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: string;
  customer_name: string;
  phone: string;
  whatsapp: string;
  intent: 'buy' | 'rent';
  property_type: PropertyType;
  preferred_area: string;
  budget_min: number;
  budget_max: number;
  bedrooms?: number;
  land_size?: string;
  urgency: 'high' | 'medium' | 'low';
  notes: string;
  status: RequirementStatus;
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
  status: AgentStatus;
  joined_date: string;
}

// ============ WHATSAPP CRM TYPES ============

export interface WhatsAppConversation {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  status: WhatsAppConversationStatus;
  assigned_to: string;
  related_listing_id?: string;
  related_listing_title?: string;
  related_inquiry_id?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  id: string;
  conversation_id: string;
  direction: WhatsAppMessageDirection;
  content: string;
  content_type: 'text' | 'image' | 'document' | 'location';
  media_url?: string;
  status: WhatsAppMessageStatus;
  sender_name: string;
  timestamp: string;
  wa_message_id?: string; // WhatsApp Business API message ID
}

export interface WhatsAppConfig {
  phone_number_id: string;
  access_token: string;
  webhook_verify_token: string;
  business_account_id: string;
  default_greeting: string;
  default_greeting_ta: string;
  auto_reply_enabled: boolean;
  auto_reply_message: string;
  auto_reply_message_ta: string;
}

// ============ DASHBOARD TYPES ============

export interface DashboardStats {
  active_listings: number;
  total_inquiries: number;
  whatsapp_leads: number;
  conversion_rate: number;
  monthly_views: number;
  pending_reviews: number;
}