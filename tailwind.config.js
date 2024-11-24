module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // 다크모드 활성화
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontSize: {
        'adaptive-sm': 'clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)',
        'adaptive-base': 'clamp(1rem, 0.34vw + 0.91rem, 1.19rem)',
        'adaptive-lg': 'clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)',
        'adaptive-xl': 'clamp(1.56rem, 1vw + 1.31rem, 2.11rem)',
        'adaptive-2xl': 'clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem)',
      },
      gridTemplateColumns: {
        'responsive': 'repeat(auto-fit, minmax(250px, 1fr))',
      },
    },
  },
  plugins: [],
};