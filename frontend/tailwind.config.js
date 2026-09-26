/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: '#1A2333',
        primary: '#3B82F6',
        primaryDark: '#2563EB',
        accent: '#10B981',
        textMain: '#F3F4F6',
        textMuted: '#9CA3AF',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
