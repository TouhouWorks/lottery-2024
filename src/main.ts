import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Entry from './components/Entry.vue'
import Lottery from './components/Lottery.vue'
import Rou from './components/Rou.vue'
import LotteryEntrants from './components/LotteryEntrants.vue'
import Admin from './components/Admin.vue'

const routes = [
  { path: '/', component: LotteryEntrants },
  { path: '/ticket/:ticketId', component: Entry },
  { path: '/lottery', component: Lottery },
  { path: '/rou', component: Rou },
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
  history: createWebHashHistory(),
  routes,
})
createApp(App).use(router).mount('#app')
