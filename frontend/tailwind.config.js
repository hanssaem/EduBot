/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      pretendard: ['Pretendard', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [require('daisyui')],
};
