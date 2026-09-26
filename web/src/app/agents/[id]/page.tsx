import AgentProfileClient from "@/components/AgentProfileClient";
import { getBuildListings } from "@/lib/build-listings";

export async function generateStaticParams() {
  const listings = await getBuildListings();
  const ids = Array.from(new Set(listings.map((listing) => listing.agent_id || listing.agent_name.toLowerCase().replace(/\s+/g, "-")).filter(Boolean)));
  return (ids.length ? ids : ["__fallback"]).map((id) => ({ id }));
}

export default function AgentProfilePage({ params }: { params: { id: string } }) {
  return <AgentProfileClient agentId={params.id} />;
}
