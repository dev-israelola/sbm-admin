import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "1.75rem" },
    },
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        ink: {
          DEFAULT: "hsl(var(--ink))",
          muted: "hsl(var(--ink-muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          soft: "hsl(var(--accent-soft))",
          ink: "hsl(var(--accent-ink))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          muted: "hsl(var(--surface-muted))",
        },
        line: "hsl(var(--line))",
        success: "hsl(var(--success))",
        warn: "hsl(var(--warn))",
        danger: "hsl(var(--danger))",
        info: "hsl(var(--info))",
        // shadcn semantic aliases
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--ink))",
        muted: {
          DEFAULT: "hsl(var(--surface-muted))",
          foreground: "hsl(var(--ink-muted))",
        },
        border: "hsl(var(--line))",
        input: "hsl(var(--line))",
        ring: "hsl(var(--accent))",
        primary: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-ink))",
        },
        secondary: {
          DEFAULT: "hsl(var(--surface-muted))",
          foreground: "hsl(var(--ink))",
        },
        destructive: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(0 0% 100%)",
        },
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--ink))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--ink))",
        },
      },
      fontFamily: {
        display: ["Inter Tight", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-md": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(35 25% 25% / 0.04), 0 8px 24px -16px hsl(35 25% 25% / 0.07)",
        lift: "0 2px 4px hsl(35 25% 25% / 0.05), 0 24px 48px -16px hsl(35 25% 25% / 0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.25s ease both",
      },
    },
  },
  plugins: [animate],
};

export default config;
