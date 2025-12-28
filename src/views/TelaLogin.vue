<script setup>

import {reactive, ref} from 'vue';
import { useAuth } from '@/stores/auth';
import { useRouter } from 'vue-router';
import axiosInstance from '@/services/http';
import Swal from 'sweetalert2'


const auth = useAuth();
const router = useRouter();

// variavel de carregamentos
let loading = ref(false);

const user = reactive({
  email: '',
  password: ''
})

async function login() {
  loading.value = true;

  axiosInstance.post('/login', user)
  .then((response) => {
    console.log(response);
    auth.setToken(response.data.data.token);
    router.push('/home');
  })
  .catch(error => {
    console.log("erro: ", error);
    Swal.fire({
      title: 'Login ou senha incorretos, tente novamente!',
      confirmButtonColor: '#000000',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  })
  .finally(() => {
    loading.value = false;
  })
}

</script>

<template>



<div class="container d-flex align-items-center justify-content-center" style="min-height: 80vh;">
    <div class="bg-body border shadow-sm p-3 p-md-5 rounded shadow-lg" style="width: 100%; max-width: 400px;">
        <p class="text-center h3 fw-bold">CRM</p>
        <p class="text-center text-muted">Bem-vindo de volta! Faça login para continuar</p>
        <form @submit.prevent="login">
            <div class="mb-3">
                <label for="nome" class="form-label">Email</label>
                <input type="email" class="form-control" placeholder="Digite seu email..." v-model="user.email">
            </div>

            <div class="mb-3">
                <label for="nome" class="form-label">Senha</label>
                <input type="password" class="form-control" placeholder="Digite sua senha..." v-model="user.password">
            </div>

            <button type="submit" class="btn btn-primary w-100">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
        </form>
    </div>
</div>
</template>