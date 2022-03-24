// https://tailwindcss.com/docs/customizing-colors
// const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: ['./src/**/*.{svelte,js,jsx,ts,tsx}', './public/*.html'],
    whitelistPatterns: [/svelte-/],
    options: {
    },
  },
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
       colors: {
          // 'white':     '#ffffff',
          // 'tahiti': {
          //    100: '#cffafe',
          //    200: '#a5f3fc',
          //    300: '#67e8f9',
          //    400: '#22d3ee',
          //    500: '#06b6d4',
          //    600: '#0891b2',
          //    700: '#0e7490',
          //    800: '#155e75',
          //    900: '#164e63',
          // },
          // ....
       }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-debug-screens'),
    require('@tailwindcss/forms'),
  ],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
}
