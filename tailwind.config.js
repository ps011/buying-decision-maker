/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        base: '5px',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        shadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        'shadow-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      translate: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      colors: {
        main: 'var(--main)',
        'main-foreground': 'var(--main-foreground)',
        border: 'var(--border)',
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        'secondary-background': 'var(--secondary-background)',
        'muted-foreground': 'var(--muted-foreground)',
      },
    },
  },
  plugins: [],
}
