import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Entry from './components/Entry.vue'
import Lottery from './components/Lottery.vue'
import Rou from './components/Rou.vue'

const routes = [
  { path: '/', component: Entry },
  { path: '/ticket/:ticketId', component: Entry },
  { path: '/lottery', component: Lottery },
  { path: '/rou', component: Rou },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
createApp(App).use(router).mount('#app')
