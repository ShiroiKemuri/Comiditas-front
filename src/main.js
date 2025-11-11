import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Importa tus estilos globales
import './assets/global.css'

const app = createApp(App)

// Usa los plugins (Pinia para estado, Router para navegación)
app.use(createPinia())
app.use(router)

// Monta la aplicación en el div con id="app" en tu index.html
app.mount('#app')