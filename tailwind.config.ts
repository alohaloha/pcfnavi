import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}", // Catch all files in the src directory
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#4B6577",
                    50: "#F2F4F6",
                    100: "#E1E7EA",
                    200: "#C5D0D4",
                    300: "#A9B9BF",
                    400: "#8DA2AA",
                    500: "#4B6577",
                    600: "#3C515F",
                    700: "#2C3C48",
                    800: "#1D2731",
                    900: "#0D1219",
                },
                accent: {
                    DEFAULT: "#3AA89F",
                    100: "#D1F0EC",
                    200: "#A3E1D9",
                    300: "#75D2C5",
                    400: "#47C3B2",
                    500: "#3AA89F",
                    600: "#2D8279",
                    700: "#205D54",
                },
                secondary: {
                    DEFAULT: "#88C070",
                    100: "#E8F5E1",
                    200: "#D1EBCA",
                    300: "#B9E0B3",
                    400: "#A2D69C",
                    500: "#88C070",
                    600: "#6C9C58",
                    700: "#4F703D",
                },
                cta: {DEFAULT: "#F9C54E"},
                cream: {DEFAULT: "#F8F6EF"},
            },
            fontFamily: {
                sans: ["var(--font-noto-sans-jp)", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;
