import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Entry from './components/Entry.vue'

import '@vuemap/vue-amap/dist/style.css'
initAMapApiLoader({
  key: 'd32b64be0e422afca8dbab9abe4467be',
  // securityJsCode: 'securityJsCode', // 新版key需要配合安全密钥使用
  plugins: [
        "AMap.Autocomplete",
        "AMap.PlaceSearch",
        "AMap.Scale",
        "AMap.OverView",
        "AMap.ToolBar",
        "AMap.MapType",
        "AMap.Geolocation",
        "AMap.Geocoder"
    ]
})
const routes = [
  { path: '/', component: Entry },
  { path: '/ticket/:ticketId', component: Entry },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
createApp(App).use(router).use(VueAMap).mount('#app')
