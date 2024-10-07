// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // Especifica las rutas de tus archivos
  theme: {
    extend: {
      colors: {
        'spa-verde-claro': '#e9ffc7',
        'spa-verde-oscuro': '#d0e1b5',
      }
    },
  },
  plugins: [],
}
