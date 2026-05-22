import prasheelUi from '@prasheel/ui/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [prasheelUi],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@prasheel/ui/dist/**/*.{js,mjs}",
  ],
}
