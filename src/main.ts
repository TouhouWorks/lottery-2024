import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Entry from './components/Entry.vue'

const routes = [
  { path: '/', component: Entry },
  { path: '/ticket/:ticketId', component: Entry },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
createApp(App).use(router).mount('#app')
