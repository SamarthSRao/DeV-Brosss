import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/normal.css'
import './assets/css/skeleton.css'
import './assets/css/global.css'
import { FontAwesomeIcon } from './plugins/font-awesome'

import VueCarousel from '@chenfengyuan/vue-carousel'

createApp(App)
	.use(router)
	.use(store)
	.component('font-awesome-icon', FontAwesomeIcon)
	.component(VueCarousel.name, VueCarousel)
	.mount('#app')
