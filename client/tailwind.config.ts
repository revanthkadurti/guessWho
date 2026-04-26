import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        lid: "0 14px 32px rgba(12, 18, 33, 0.35)"
      }
    }
  },
  plugins: []
} satisfies Config;
