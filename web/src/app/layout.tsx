import type { Metadata } from "next";
import "./globals.css";
import FirebaseProvider from "@/components/FirebaseProvider";

export const metadata: Metadata = {
  title: {
    default: "Yaal Nilam | Find Land, Homes & Rentals in Jaffna",
    template: "%s | Yaal Nilam",
  },
  description:
    "Jaffna's smarter property platform. Browse land, houses, rentals, and commercial spaces across the Jaffna Peninsula. WhatsApp-first. Bilingual Tamil & English.",
  keywords: [
    "Jaffna property", "Jaffna real estate", "யாழ்ப்பாணம் சொத்து",
    "land for sale Jaffna", "houses for rent Jaffna", "Nallur property",
    "Jaffna land", "commercial property Jaffna", "Yaal Nilam", "யாழ் நிலம்",
    "buy land Jaffna", "rent house Jaffna", "Jaffna Peninsula real estate",
  ],
  openGraph: {
    title: "Yaal Nilam — Find Land, Homes & Rentals in Jaffna",
    description: "Browse land, houses, rentals, and commercial spaces across Jaffna Peninsula. WhatsApp-first property platform.",
    url: "https://yaalnilam.lk",
    siteName: "Yaal Nilam",
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yaal Nilam — Jaffna's Smarter Property Platform",
    description: "Find land, homes & rentals across Jaffna. WhatsApp-first. Bilingual.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://yaalnilam.lk",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "Yaal Nilam",
              alternateName: "யாழ் நிலம்",
              url: "https://yaalnilam.lk",
              description: "Jaffna's smarter property platform for land, homes, rentals, and commercial spaces.",
              areaServed: {
                "@type": "Place",
                name: "Jaffna Peninsula, Sri Lanka",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["English", "Tamil"],
              },
            }),
          }}
        />
        {/* JSON-LD: WebSite with search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Yaal Nilam",
              url: "https://yaalnilam.lk",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://yaalnilam.lk/properties?search={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-sand-50 flex flex-col">
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  );
}
