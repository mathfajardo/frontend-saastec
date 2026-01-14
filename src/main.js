import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueMask from 'vue-the-mask';
import VueTippy from 'vue-tippy'; // ou import { plugin as VueTippy } from 'vue-tippy';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(VueTippy, {
  directive: 'tippy', // Define a diretiva como v-tippy
  component: 'Tippy', // Define o componente como <Tippy/>
  // Opções globais para todos os tooltips (opcional)
});

app.use(VueMask)

app.mount('#app')
