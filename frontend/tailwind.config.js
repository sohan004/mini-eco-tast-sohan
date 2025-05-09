/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        spaceGrotesk: ["Space Grotesk", "sans-serif"],
        plusJakarta: ["Plus Jakarta Sans", "sans-serif"],
        chivo: ["Chivo", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        madimiOne: ["Madimi One", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        plexSans: ["IBM Plex Sans", "sans-serif"],
      },
      width: {
        maxWidth: "1170px",
      },
      colors: {
        primary: "#620caa",
        textBg: "#EEEEEE",
        "header-text": "#1C163C",
        "descrip-text": "#645E80",
        pri: "linear-gradient(180deg, #be72ff 0%, #620caa 100%)",
        // 'secondary': "#E10FA3",
      },
      backgroundImage: {
        primaryButton: "linear-gradient(180deg, #be72ff 0%, #620caa 100%)",
        transparentBg: "linear-gradient(180deg, #be72ff00 0%, #620caa00 100%)",
      },
    },
  },
  plugins: [],
};
