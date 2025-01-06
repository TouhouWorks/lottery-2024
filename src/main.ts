import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Admin from './components/Admin.vue'
import Entry from './components/Entry.vue'
import LotteryEntrants from './components/LotteryEntrants.vue'
import Roll from './components/Roll.vue'
import './style.css'

const routes = [
  { path: '/', component: LotteryEntrants },
  { path: '/ticket/:ticketId', component: Entry },
  { path: '/roll', component: Roll },
  {
    path: '/lotteryEntrants',
    component: LotteryEntrants,
  },
  {
    path: '/admin',
    component: Admin,
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
createApp(App).use(router).mount('#app')
