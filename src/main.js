import App from "./App.svelte"

const app = new App({
  target: document.body
})

export default app

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
const hot = import.meta.hot
if (hot) {
  hot.accept();
  hot.dispose(() => {
    app.$destroy()
  })
}
