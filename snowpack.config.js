/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: {url: '/', static: true},
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-postcss',
    [
      "@snowpack/plugin-run-script",
      {
        "cmd": "svelte-check --output human && postcss src/styles.css -o public/styles.css",
        "watch": "postcss src/styles.css -o public/styles.css -w"
      }
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  devOptions: {
    // don't open browser
    // open: 'none',
    // don't clear the output
    // output: 'stream'
  },
  buildOptions: {
    /* ... */
  },
  optimize: {
      "bundle": false,
      "minify": true,
      "splitting": true,
      "treeshake": true,
      "preload": true,
      "target": 'es2020'
  }
};
