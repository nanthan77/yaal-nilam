import { PROPERTIES } from "./data";
import { normalizeListing } from "./marketplace";

const SECONDARY_SAMPLE_MEDIA: Record<string, string> = {
  villa: "/properties/villa_island.webp",
  house: "/properties/house_heritage.webp",
};

// Opt in with `npm run dev:fixtures`. Never enabled by a production build,
// even if the public flag is accidentally carried into its environment.
export const DEVELOPMENT_PROPERTY_FIXTURES =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES === "true"
    ? [
        ...PROPERTIES,
        {
          ...PROPERTIES[0],
          id: "prop-demo-related-jaffna-fort",
          title: "Related villa layout sample",
          title_ta: "தொடர்புடைய வில்லா காட்சி மாதிரி",
          listing_code: "DEMO-RELATED",
          description: "Development layout sample for testing related listing navigation. Not an available property.",
          description_ta: "தொடர்புடைய சொத்து இணைப்பைச் சோதிப்பதற்கான வடிவமைப்பு மாதிரி. விற்பனைக்கான சொத்து அல்ல.",
          featured: false,
          verified: false,
        },
      ].map((property) => normalizeListing({
        ...property,
        is_development_fixture: true,
        submission_source: "development_fixture",
        title: `[DEVELOPMENT SAMPLE] ${property.title}`,
        title_ta: `[மாதிரி — DEVELOPMENT] ${property.title_ta || property.title}`,
        media_urls: [...new Set([
          ...(property.media_urls || []),
          ...(SECONDARY_SAMPLE_MEDIA[property.property_type || ""] ? [SECONDARY_SAMPLE_MEDIA[property.property_type || ""]] : []),
        ])],
      }))
    : [];
