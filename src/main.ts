import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Entry from './components/Entry.vue'
import Roll from './components/Roll.vue'
import LotteryEntrants from './components/LotteryEntrants.vue'
import Admin from './components/Admin.vue'

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
