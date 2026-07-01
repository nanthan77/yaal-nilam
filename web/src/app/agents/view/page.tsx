"use client";

import { useEffect, useState } from "react";
import AgentProfileClient from "@/components/AgentProfileClient";

export default function AgentViewPage() {
  const [agentId, setAgentId] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const match = window.location.pathname.match(/^\/agents\/([^/]+)\/?/);
    const extractedId = match?.[1];
    if (extractedId && extractedId !== "view") {
      setAgentId(extractedId);
      return;
    }
    setAgentId("");
  }, []);

  if (!agentId) {
    return <div className="min-h-screen bg-sand-50" />;
  }

  return <AgentProfileClient agentId={agentId} />;
}
