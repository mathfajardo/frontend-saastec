import Cliente from '@/views/Cliente.vue'
import Home from '@/views/Home.vue'
import Lead from '@/views/Lead.vue'
import LeadCadastro from '@/views/LeadCadastro.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', 
      name: 'home',
      component: Home
    },
    {
      path: '/lead', 
      name: 'lead',
      component: Lead
    },
    {
      path: '/leadcadastro', 
      name: 'leadcadastro',
      component: LeadCadastro
    },
    {
      path: '/cliente', 
      name: 'cliente',
      component: Cliente
    }
  ],
})

export default router
