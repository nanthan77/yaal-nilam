import AgentProfileClient from "@/components/AgentProfileClient";
import { PROPERTIES } from "@/lib/data";

function fallbackAgentId(listing: any) {
  if (listing.agent_id) return listing.agent_id;
  if (!listing.agent_name) return "";
  return listing.agent_name.toLowerCase().replace(/\s+/g, "-");
}

export function generateStaticParams() {
  const ids = Array.from(new Set(PROPERTIES.map(fallbackAgentId).filter(Boolean)));
  if (ids.length === 0) ids.push("sample-agent");
  return ids.map((id) => ({ id }));
}

export default function AgentProfilePage({ params }: { params: { id: string } }) {
  return <AgentProfileClient agentId={params.id} />;
}
