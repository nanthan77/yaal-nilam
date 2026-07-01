/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand Palette ─────────────────────────────────
        // Deep navy — trust, professionalism
        navy: {
          50:  "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#0a1929",
        },
        // Muted teal — accent, action
        teal: {
          50:  "#effcf6",
          100: "#c6f7e2",
          200: "#8eedc7",
          300: "#65d6ad",
          400: "#3ebd93",
          500: "#27ab83",
          600: "#199473",
          700: "#147d64",
          800: "#0c6b58",
          900: "#014d40",
        },
        // Sand / warm off-white — backgrounds
        sand: {
          50:  "#fefdfb",
          100: "#fdf8f0",
          200: "#f9f0e3",
          300: "#f0e4d0",
          400: "#e3d5be",
          500: "#d4c4a8",
          600: "#b8a78e",
          700: "#9c8b74",
          800: "#7d6f5c",
          900: "#5e5345",
        },
        // Terracotta / warm gold — sparingly
        warm: {
          50:  "#fff8f1",
          100: "#feecdc",
          200: "#fcd9bd",
          300: "#fdba8c",
          400: "#ff8a4c",
          500: "#e8702a",
          600: "#cc5d1e",
          700: "#a44a1e",
          800: "#87401f",
          900: "#6e371f",
        },
        // Charcoal — text, headings
        charcoal: {
          50:  "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#0f1419",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Tamil", "system-ui", "sans-serif"],
        tamil: ["Noto Sans Tamil", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display":    ["3rem",   { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm": ["2.25rem",{ lineHeight: "1.2",  letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "card":    "0 1px 3px 0 rgba(16, 42, 67, 0.06), 0 1px 2px -1px rgba(16, 42, 67, 0.06)",
        "card-lg": "0 4px 6px -1px rgba(16, 42, 67, 0.08), 0 2px 4px -2px rgba(16, 42, 67, 0.06)",
        "card-xl": "0 10px 25px -3px rgba(16, 42, 67, 0.1), 0 4px 10px -4px rgba(16, 42, 67, 0.08)",
        "float":   "0 20px 60px -15px rgba(16, 42, 67, 0.2)",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "4.5": "1.125rem",
      },
      minHeight: {
        "touch": "44px",
        "touch-lg": "48px",
      },
      minWidth: {
        "touch": "44px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      // Constrain prose for readability (45-90 chars, ideal 66)
      maxWidth: {
        "prose": "72ch",
        "prose-sm": "55ch",
      },
      screens: {
        "touch": { raw: "(hover: none)" },
      },
    },
  },
  plugins: [],
};
