/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#109B32",
        accent: "#005BC2",
        danger: "#E11435",
        success: "#007003",
        light: "#6B7280",
        dark: "#1F2937",
        border1: "#E8E8E8",
        border2: "#E5E7EB",
        border3: "#F3F4F6",
        border4: "#E6E7ECB2",
        bg1: "#FAFAFA",
        bg2: "#E9E9E933",
        bg3: "#F9FAFB",
        bgDark: "#1F2937",
        placeholder: "#9AA1B1",
        input: "#34373F",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
};
