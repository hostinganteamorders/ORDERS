/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FF7A00', // Warna oranye dari "ORDERS"
                secondary: '#061E44', // Warna biru tua/navy dari logo gear
                teal: '#3D8C95', // Warna teal dari tagline
                dark: '#1F2937', // Tetap untuk teks gelap
                medium: '#4B5563', // Tetap untuk teks medium
                light: '#F9FAFB', // Tetap untuk background
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }, animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'float-slow': 'float-slow 8s ease-in-out infinite',
                'float-medium': 'float-medium 6s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-150%)' },
                    '100%': { transform: 'translateX(150%)' },
                },
                'float-slow': {
                    '0%': { transform: 'translateY(0) rotate(0)' },
                    '50%': { transform: 'translateY(-15px) rotate(3deg)' },
                    '100%': { transform: 'translateY(0) rotate(0)' },
                },
                'float-medium': {
                    '0%': { transform: 'translateY(0) rotate(0)' },
                    '50%': { transform: 'translateY(-10px) rotate(2deg)' },
                    '100%': { transform: 'translateY(0) rotate(0)' },
                },
            },
            maxWidth: {
                'content': '1200px',
            }, borderRadius: {
                'large': '16px',
            }
        }
    },
    plugins: [],
}

