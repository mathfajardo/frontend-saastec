import Cliente from '@/views/Cliente.vue'
import Home from '@/views/Home.vue'
import Lead from '@/views/Lead.vue'
import LeadCadastro from '@/views/LeadCadastro.vue'
import TelaLogin from '@/views/TelaLogin.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'
import ClienteCadastro from '@/views/ClienteCadastro.vue'
import RotaErro from '@/views/RotaErro.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', 
      name: 'login',
      component: TelaLogin,
      meta: {
        esconderNav: true
      }
    },
    {
      path: "/:pathMatch(.*)*",
      name: "error",
      component: RotaErro,
      meta: {
        esconderNav: true
      }
    },
    {
      path: '/home', 
      name: 'home',
      component: Home,
      meta: {
        auth: true
      }
    },
    {
      path: '/lead', 
      name: 'lead',
      component: Lead,
      meta: {
        auth: true
      }
    },
    {
      path: '/leadcadastro', 
      name: 'leadcadastro',
      component: LeadCadastro,
      meta: {
        auth: true
      }
    },
    {
      path: '/cliente', 
      name: 'cliente',
      component: Cliente,
      meta: {
        auth: true
      }
    },
    {
      path: '/clientecadastro/:id',
      name: 'clientecadastro',
      component: ClienteCadastro,
      meta: {
        auth: true
      }
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
