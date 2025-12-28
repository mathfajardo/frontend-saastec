import Cliente from '@/views/Cliente.vue'
import Home from '@/views/Home.vue'
import Lead from '@/views/Lead.vue'
import LeadCadastro from '@/views/LeadCadastro.vue'
import TelaLogin from '@/views/TelaLogin.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home', 
      name: 'home',
      component: Home
    },
    {
      path: '/', 
      name: 'login',
      component: TelaLogin,
      meta: {
        esconderNav: true
      }
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

router.beforeEach(async (to, from, next) => {
  if (to.meta?.auth) {
    const auth = useAuth();
    if (auth.token) {
      try {
        const autenticado = await auth.checkToken();
        if (autenticado) {
          next();
        } else {
          next({name: 'login'});
        }
      } catch (error) {
        next({name: 'login'});
      }
    } else {
      next({name: 'login'})
    }
  } else {
    next();
  }
})

export default router
