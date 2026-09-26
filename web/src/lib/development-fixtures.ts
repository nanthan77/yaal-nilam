import { PROPERTIES } from "./data";
import { normalizeListing } from "./marketplace";

// Opt in with `npm run dev:fixtures`. Never enabled by a production build,
// even if the public flag is accidentally carried into its environment.
export const DEVELOPMENT_PROPERTY_FIXTURES =
  process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES === "true"
    ? PROPERTIES.map((property) => normalizeListing({
        ...property,
        title: `[DEVELOPMENT SAMPLE] ${property.title}`,
        title_ta: `[மாதிரி — DEVELOPMENT] ${property.title_ta || property.title}`,
      }))
    : [];
