/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary:  '#56778f',
        accent:   '#43a889',
        secondary:'#91be6f',
        cta:      '#f9c54e',
        cream:    '#f4f1e8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-sans-jp)', 'sans-serif'],
        jp: ['var(--font-noto-sans-jp)', 'sans-serif'],
        display: ['var(--font-rubik)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
