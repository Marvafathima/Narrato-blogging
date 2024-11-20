/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'andika': ['Andika', 'sans-serif'],
      },
      colors: {
        green: {
          50: "#e8f5e9",
          100: "#c8e6c9",
          200: "#a5d6a7",
          300: "#81c784",
          400: "#66bb6a",
          500: "#4caf50",
          600: "#43a047",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
        },
        deep_orange: {
          50: "#fbe9e7",
          100: "#ffccbc",
          200: "#ffab91",
          300: "#ff8a65",
          400: "#ff7043",
          500: "#ff5722",
          600: "#f4511e",
          700: "#e64a19",
          800: "#d84315",
          900: "#bf360c",
        },
        orange:{
          10:"#faf6f5",
          50:"#f5eeeb",
          100:"#ed8153",},
        deep_green:"#4fc978",
        ocean_green:{
          50:"#49ab92",
          100:"#27b390"
        
        },
        ash:"#e6eae8",
        cyan:"#8ab5aa",
        light_blue:"#b4c9ca",
        light_rose:"#d7a48b",

      },
    },
  },
  plugins: [],
});

