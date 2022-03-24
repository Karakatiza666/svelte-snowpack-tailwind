// https://codechips.me/snowpack-for-svelte-revisited/
// https://flaviocopes.com/tailwind-setup/

const tailwindcss = require("tailwindcss")
const autoprefixer = require("autoprefixer")
const cssnano = require('cssnano')({
  preset: 'default'
})
const purgecss = require('@fullhuman/postcss-purgecss')(({
  content: ['./layouts/**/*.html', './src/**/*.svelte', './src/**/*.jsx', './src/**/*.tsx'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
}))

module.exports = () => ({ 
    plugins: process.env.NODE_ENV === 'production'
    ? [ tailwindcss, purgecss, autoprefixer, cssnano ]
    : [ tailwindcss, purgecss ]
  })
