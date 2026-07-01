export type AgencyTierId = "starter" | "pro" | "agency" | "enterprise";

export const AGENCY_ACCOUNT_TIERS = [
  {
    id: "starter" as AgencyTierId,
    label: "Starter agent",
    publicLabel: "Free agent profile",
    price: "Free",
    bestFor: "Individual agents and owners starting with a small listing count.",
    publicFeatures: [
      "Verified public profile URL",
      "Basic listing catalogue",
      "WhatsApp and phone contact",
      "Service areas and specialties",
    ],
    internalFeatures: [
      "Pending verification workflow",
      "Manual admin approval",
      "Basic listing and lead rollup",
    ],
  },
  {
    id: "pro" as AgencyTierId,
    label: "Pro agent",
    publicLabel: "Pro verified profile",
    price: "Paid",
    bestFor: "High-activity solo agents who want better trust and traffic.",
    publicFeatures: [
      "Logo and branded cover",
      "Business registration details",
      "Social media links",
      "Profile traffic analytics",
      "Featured listing slots",
    ],
    internalFeatures: [
      "Lead CRM pipeline",
      "Response SLA tracking",
      "Priority approval queue",
      "Weekly performance report",
    ],
  },
  {
    id: "agency" as AgencyTierId,
    label: "Agency team",
    publicLabel: "Premium agency profile",
    price: "Paid",
    bestFor: "Registered companies with multiple agents, branches, and listings.",
    publicFeatures: [
      "Company logo and office details",
      "Team/branch information",
      "Verified company registration",
      "All listings under one agency catalogue",
      "Premium trust badge",
    ],
    internalFeatures: [
      "Team seats and role access",
      "Lead assignment to staff",
      "Social lead monitor CRM",
      "Campaign and ranking analytics",
      "Exportable owner/buyer pipeline",
    ],
  },
  {
    id: "enterprise" as AgencyTierId,
    label: "Enterprise / family office",
    publicLabel: "Enterprise partner",
    price: "Custom",
    bestFor: "Developers, family offices, diaspora property teams, and large agencies.",
    publicFeatures: [
      "Dedicated landing profile",
      "Development/project showcase",
      "Premium buyer trust package",
      "Multilingual contact routing",
      "Priority marketplace placement",
    ],
    internalFeatures: [
      "Custom CRM reporting",
      "Dedicated account manager",
      "API/import support",
      "Compliance document checklist",
      "Private owner inventory workflow",
    ],
  },
];

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  x: "X",
  twitter: "X",
  website: "Website",
};

function cleanText(value?: unknown) {
  return (value || "").toString().trim();
}

function cleanUrl(value?: unknown) {
  const text = cleanText(value);
  if (!text) return "";
  if (/^https?:\/\//i.test(text)) return text;
  if (text.includes(".") && !text.includes(" ")) return `https://${text}`;
  return text;
}

export function getAgencyTier(value?: string) {
  const normalized = cleanText(value).toLowerCase() as AgencyTierId;
  return AGENCY_ACCOUNT_TIERS.find((tier) => tier.id === normalized) || AGENCY_ACCOUNT_TIERS[0];
}

export function normalizeSocialLinks(raw: any) {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => ({
        platform: cleanText(item.platform || item.label || item.name).toLowerCase(),
        label: cleanText(item.label || SOCIAL_LABELS[cleanText(item.platform).toLowerCase()] || item.platform),
        url: cleanUrl(item.url || item.href),
      }))
      .filter((item) => item.platform && item.url);
  }

  const source = raw && typeof raw === "object" ? raw : {};
  return Object.entries(source)
    .map(([platform, url]) => ({
      platform,
      label: SOCIAL_LABELS[platform] || platform,
      url: cleanUrl(url),
    }))
    .filter((item) => item.url);
}

export function normalizeAgencyProfile(agent: any) {
  const tier = getAgencyTier(agent?.agency_plan || agent?.subscription_plan || agent?.plan);
  const socialLinks = normalizeSocialLinks(
    agent?.social_links || {
      facebook: agent?.facebook_url,
      instagram: agent?.instagram_url,
      youtube: agent?.youtube_url,
      tiktok: agent?.tiktok_url,
      linkedin: agent?.linkedin_url,
      x: agent?.x_url || agent?.twitter_url,
    }
  );
  const website = cleanUrl(agent?.website || agent?.website_url);
  const publicEmail = cleanText(agent?.public_email || agent?.email);
  const registrationNo = cleanText(
    agent?.company_registration_no ||
      agent?.business_registration_no ||
      agent?.business_registration_number ||
      agent?.br_number
  );
  const licenseNo = cleanText(agent?.license_no || agent?.realtor_license_no || agent?.agent_license_no);
  const officeAddress = cleanText(agent?.office_address || agent?.address);
  const languages = Array.isArray(agent?.languages) && agent.languages.length > 0
    ? agent.languages
    : ["Tamil", "English"];
  const teamSize = Number(agent?.team_size || agent?.team_members_count || 0);
  const yearsExperience = Number(agent?.years_experience || agent?.experience_years || 0);
  const isPremium = ["pro", "agency", "enterprise"].includes(tier.id);

  return {
    tier,
    isPremium,
    logoUrl: cleanUrl(agent?.logo_url || agent?.company_logo_url || agent?.logo),
    coverUrl: cleanUrl(agent?.cover_url || agent?.company_cover_url),
    agencyType: cleanText(agent?.agency_type || (teamSize > 1 ? "Registered agency" : "Independent agent")),
    publicEmail,
    internalEmail: cleanText(agent?.internal_email || agent?.billing_email || agent?.email),
    website,
    socialLinks,
    registrationNo,
    licenseNo,
    officeAddress,
    registrationVerified: Boolean(agent?.registration_verified || agent?.company_registration_verified),
    languages,
    teamSize,
    yearsExperience,
    businessHours: cleanText(agent?.business_hours || "Mon-Sat, 9:00 AM - 6:00 PM"),
    accountManager: cleanText(agent?.account_manager || ""),
    billingStatus: cleanText(agent?.billing_status || agent?.subscription_status || "free"),
    internalNotes: cleanText(agent?.internal_notes || ""),
    publicBadges: [
      agent?.verified ? "Identity checked" : "",
      agent?.nic_uploaded ? "NIC reviewed" : "",
      registrationNo ? "Business registration listed" : "",
      isPremium ? tier.publicLabel : "",
    ].filter(Boolean),
    missingPublicItems: [
      !agent?.logo_url && !agent?.company_logo_url ? "Company logo" : "",
      !registrationNo ? "Company registration number" : "",
      !website ? "Website" : "",
      socialLinks.length === 0 ? "Social links" : "",
      !officeAddress ? "Office address" : "",
    ].filter(Boolean),
  };
}
