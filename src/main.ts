import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import detectEthereumProvider from '@metamask/detect-provider'
import App from './App.vue'
import { routes } from './routes'
import './index.css'
import store from './store'

(async () => {
  const app = createApp(App)

  const router = createRouter({
    history: createWebHistory(),
    routes: import.meta.hot ? [] : routes,
  })

  app.use(store)
  app.use(router)

  if (await detectEthereumProvider()) {
    app.mount('#app')
  } else {
    alert('🦊 Please install MetaMask! 🦊')
  }
})()
