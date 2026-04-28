/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gold: '#FFBC00',
        navy: '#0D1B2E',
        softgreen: '#F3F8F3',
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        sansita: ['Sansita', 'cursive'],
        satisfy: ['Satisfy', 'cursive'],
        reem: ['"Reem Kufi Ink"', 'serif'],
      },
      maxWidth: {
        container: '1140px',
      },
    },
  },
  plugins: [],
};
