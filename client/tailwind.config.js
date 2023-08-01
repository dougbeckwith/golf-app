module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "text-2xl",
    "text-3xl",
    {
      pattern: /bg-(fuchsia|red|green|blue|pink|gray|dark|teal)-(100|200|300|400|500|600|700)/
    }
  ],
  theme: {
    screens: {
      xs: "460px",
      // => @media (min-width: 460px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px"
      // => @media (min-width: 1536px) { ... }
    },
    colors: {
      red: {
        100: "#f43f5e",
        200: "#e11d48"
      },
      gray: {
        100: "#d1d5db",
        200: "#9ca3af"
      },
      green: {
        100: "#059669"
      },
      // dark: {
      //   100: "#222222",
      //   200: "#1E1E1E"
      // },
      dark: {
        100: "#27272a",
        200: "#222222",
        300: "#1E1E1E"
      },

      blue: {
        100: "#007acc",
        200: "#0790DB",
        300: "#0369a1",
        400: "#015187",
        500: "#011c2e"
      },
      teal: {
        100: "#0f766e",
        200: "#115e59"
      },
      fuchsia: {
        700: "#a21caf"
      }
    },
    extend: {}
  },
  plugins: []
};
