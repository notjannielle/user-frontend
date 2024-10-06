/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js" // Keep this line
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'], // Add your desired font here
        serif: ['"Merriweather"', 'serif'],
        mono: ['"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin') // Keep this line
  ],
}
