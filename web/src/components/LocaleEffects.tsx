"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function LocaleEffects() {
  const { locale } = useStore();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale === "ta" ? "ta-LK" : "en-LK";
    html.setAttribute("data-locale", locale);
  }, [locale]);

  return null;
}
