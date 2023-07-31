module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "text-2xl",
    "text-3xl",
    {
      pattern: /bg-(red|green|blue|pink|gray|dark|teal)-(100|200|300|400|500|600)/
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
        100: "#be123c",
        200: "#9f1239"
      },
      gray: {
        100: "#d1d5db",
        200: "#9ca3af"
      },
      dark: {
        100: "#222222",
        200: "#1E1E1E"
      },
      blue: {
        300: "#0790DB",
        100: "#007acc"
      },
      teal: {
        100: "#0d9488",
        200: "#6ee7b7"
      }
    },
    extend: {}
  },
  plugins: []
};
