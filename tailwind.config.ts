import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7A00',
        secondary: '#0EA5E9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
}

export default config
