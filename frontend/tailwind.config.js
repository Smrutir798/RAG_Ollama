/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'medical-primary': {
                    DEFAULT: '#0ea5e9',
                },
                'medical-secondary': {
                    DEFAULT: '#f0f9ff',
                },
                'medical-warning': {
                    DEFAULT: '#f59e0b',
                },
                'medical-error': {
                    DEFAULT: '#ef4444',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
