import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueMask from 'vue-the-mask'; // mascara input
import VueTippy from 'vue-tippy'; // tipsss ???

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(VueTippy, {
  directive: 'tippy', 
  component: 'Tippy', 
});

app.use(VueMask)

app.mount('#app')
