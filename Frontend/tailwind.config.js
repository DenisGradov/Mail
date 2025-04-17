// tailwind.config.js

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      screens: {
        '375px': '375px',
        '450px': '450px',
        '470px': '470px',
        '840px': '840px',
        '1320px': '1320px',
        '1000px': '1000px',
      },
      fontFamily: {
        sans: ['SF Pro Display', 'sans-serif'],
      },
      colors: {
        // Текст
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-secondary-60': 'var(--text-secondary-60)',

        // Основные цвета
        primary: 'var(--color-primary)',
        'primary-10': 'var(--color-primary-10)',
        'primary-50': 'var(--color-primary-50)',

        // Фоны
        'bg-main': 'var(--color-bg)',
        container: 'var(--color-container)',
        input: 'var(--color-input)',
        accent: 'var(--color-accent)',
        'bg-hover': 'var(--color-hover)',
        'bg-active': 'var(--color-active)',

        // Иконки, границы, меню
        stroke: 'var(--color-stroke)',
        'stroke-medium': 'var(--color-stroke-medium)',
        icons: 'var(--color-icons)',
        menu: 'var(--color-menu)',
      },
    },
  },
  plugins: [],
};
