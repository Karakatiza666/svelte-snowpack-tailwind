// @ts-check

/** This script modifies the project to support TS code in .svelte files like:

  <script lang="ts">
  	export let name: string;
  </script>
 
  As well as validating the code for CI.
  */

/**  To work on this script:
  rm -rf test-template template && git clone sveltejs/template test-template && node scripts/setupTypeScript.js test-template
*/

const fs = require("fs")
const path = require("path")
const { argv } = require("process")

const projectRoot = argv[2] || path.join(__dirname, "..")

// Add deps to pkg.json
const packageJSON = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"))
packageJSON.devDependencies = Object.assign(packageJSON.devDependencies, {
  "svelte-check": "^2.0.0",
  "svelte-preprocess": "^4.0.0",
  "@snowpack/plugin-typescript": "^1.2.1",
  "typescript": "^4.0.0",
  "tslib": "^2.0.0",
  "@tsconfig/svelte": "^2.0.1",
})

// Add script for checking
packageJSON.scripts = Object.assign(packageJSON.scripts, {
  "check": "svelte-check --tsconfig ./tsconfig.json"
})

// Write the package JSON
fs.writeFileSync(path.join(projectRoot, "package.json"), JSON.stringify(packageJSON, null, "  "))

// Switch the app.svelte file to use TS
const mainSveltePath = path.join(projectRoot, "src", "main.js")
let mainFile = fs.readFileSync(mainSveltePath, "utf8")
mainFile = mainFile.replace("import.meta.hot", "(import.meta as any).hot")
fs.writeFileSync(mainSveltePath, mainFile)

// mv src/main.js to main.ts
const beforeMainJSPath = path.join(projectRoot, "src", "main.js")
const afterMainTSPath = path.join(projectRoot, "src", "main.ts")
fs.renameSync(beforeMainJSPath, afterMainTSPath)

// Switch the app.svelte file to use TS
const appSveltePath = path.join(projectRoot, "src", "App.svelte")
let appFile = fs.readFileSync(appSveltePath, "utf8")
appFile = appFile.replace("<script>", '<script lang="ts">')
appFile = appFile.replace("export let name;", 'export let name: string;')
fs.writeFileSync(appSveltePath, appFile)

// Edit snowpack config
const snowpackConfigPath = path.join(projectRoot, "snowpack.config.js")
let snowpackConfig = fs.readFileSync(snowpackConfigPath, "utf8")

// Edit plugins
snowpackConfig = snowpackConfig.replace(`'@snowpack/plugin-svelte',`, `'@snowpack/plugin-svelte',
    '@snowpack/plugin-typescript',`)

fs.writeFileSync(snowpackConfigPath, snowpackConfig)

// Add TSConfig
const tsconfig = `{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "module": "es2020",
    /**
     * Typecheck JS in .svelte and .js files by default.
     * Disable checkJs if you'd like to use dynamic types in JS.
     * Note that setting allowJs false does not prevent the use
     * of JS in .svelte files.
     */
    "allowJs": true,
    "checkJs": true
  },
  "include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.js", "src/**/*.svelte"],
  "exclude": ["node_modules/*", "__sapper__/*", "public/*"]
}`
const tsconfigPath =  path.join(projectRoot, "tsconfig.json")
fs.writeFileSync(tsconfigPath, tsconfig)

// Add global.d.ts
const dtsPath =  path.join(projectRoot, "src", "global.d.ts")
fs.writeFileSync(dtsPath, `/// <reference types="svelte" />`)

// Delete this script, but not during testing
if (!argv[2]) {
  // Remove the script
  fs.unlinkSync(path.join(__filename))

  // Check for Mac's DS_store file, and if it's the only one left remove it
  const remainingFiles = fs.readdirSync(path.join(__dirname))
  if (remainingFiles.length === 1 && remainingFiles[0] === '.DS_store') {
    fs.unlinkSync(path.join(__dirname, '.DS_store'))
  }

  // Check if the scripts folder is empty
  if (fs.readdirSync(path.join(__dirname)).length === 0) {
    // Remove the scripts folder
    fs.rmdirSync(path.join(__dirname))
  }
}

// Adds the extension recommendation
fs.mkdirSync(path.join(projectRoot, ".vscode"), { recursive: true })
fs.writeFileSync(path.join(projectRoot, ".vscode", "extensions.json"), `{
  "recommendations": ["svelte.svelte-vscode"]
}
`)

console.log("Converted to TypeScript.")

if (fs.existsSync(path.join(projectRoot, "node_modules"))) {
  console.log("\nYou will need to re-run your dependency manager to get started.")
}
