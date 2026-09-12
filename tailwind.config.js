/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design system "Nocturne Glow" — dark-only (docs/06).
        // RÈGLE ABSOLUE : aucun #FFFFFF — texte max crème #F9ECE5.
        night: "#14121e", // surface / background
        canvas: "#1B1924", // canvas base (OLED pitch)
        "card-surface": "#282532", // Surface Level 1 (cards)
        "elevated-surface": "#322E3F", // Surface Level 2 (sheets, modals)
        "surface-container-lowest": "#0f0c18",
        "surface-container-low": "#1d1a26",
        "surface-container": "#211e2b",
        "surface-container-high": "#2b2835",
        "surface-container-highest": "#363340",
        cream: "#F9ECE5", // texte principal (crème chaud)
        lavender: "#9C9BE5", // texte secondaire
        "lilac-mauve": "#C5A7CE", // métadonnées, timestamps
        "on-surface": "#e6e0f2",
        outline: "#928ea0",
        "outline-variant": "#474555",
        primary: "#7665FA", // indigo brand
        "primary-light": "#c6bfff",
        "primary-container": "#8c7fff",
        secondary: "#c2c1ff",
        "secondary-soft": "#9C9BE5",
        tertiary: "#dbbce4",
        "tertiary-soft": "#C5A7CE",
        error: "#ffb4ab",
        "activity-feed": "#8893fe", // accent Feed (périwinkle)
        "activity-sleep-base": "#3a4674",
        "activity-sleep-accent": "#4e5d94",
        "activity-diaper": "#dbbce4",
        success: "#4caf50",
        warning: "#ffc107",
        danger: "#f44336",
      },
      fontFamily: {
        sans: [
          "PlusJakartaSans_400Regular",
          "PlusJakartaSans_500Medium",
          "PlusJakartaSans_600SemiBold",
          "PlusJakartaSans_700Bold",
        ],
      },
      borderRadius: {
        DEFAULT: "16px", // cards, data modules
        md: "24px",
        lg: "32px", // bottom sheets, modales
        xl: "48px",
      },
    },
  },
  plugins: [],
};
