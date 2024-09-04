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
        primary: "#13151a",
        alt: "#171c27",
        border: "#1f232f",
        purple: "#7540dc",
        blue: "#22B9E8",
        txt: "#a1a3a5",
        txt2: "#737886",
      },
    },
  },
  plugins: [],
};
