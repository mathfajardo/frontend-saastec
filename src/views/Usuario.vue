<script setup>
import { onMounted, ref } from 'vue';
import axiosInstance from '@/services/http';
import Swal from 'sweetalert2'

// iniciando o array produtos
let usuarios = ref([]);
let usuariosOriginal = ref([]);
let termoPesquisa = ref('');

// carregamento
let carregamento = ref(true);

onMounted(() => {
  axiosInstance.get('/user/')
    .then(response => {
      usuarios.value = response.data.data;
      usuariosOriginal.value = response.data.data;
      carregamento.value = false;
    })
    .catch(error => {
      console.error('Erro: ', error);
      carregamento.value = false;
    })
});

// pesquisar
function pesquisar() {
  if (!termoPesquisa.value.trim()) {
    usuarios.value = usuariosOriginal.value;
    return;
  }

  const termo = termoPesquisa.value.toLowerCase();
  usuarios.value = usuariosOriginal.value.filter(usuario =>
    usuario.name.toLowerCase().includes(termo) //||
    // cliente.categoria.toLowerCase().includes(termo) ||
    // cliente.valor_produto.toLowerCase().includes(termo)
  );

  termoPesquisa.value = '';
}


</script>

<template>

  <!-- tela de carregamento -->
  <div class="d-flex flex-column justify-content-center align-items-center vh-100" v-if="carregamento">
    <div class="spinner-border">
      <span class="visually-hidden">Aguarde...</span>
    </div>
  </div>

  <!-- Cabeçalho -->
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="mb-0"><i class="bi bi-person"></i> Lista de usuarios</h1>
  </div>

  <div class="d-flex aling-items-center" v-if="!carregamento">
    <form class="d-flex m-2" role="search" @submit.prevent="pesquisar">
      <input class="form-control me-2" type="search" placeholder="Pesquisar..." v-model="termoPesquisa">
      <button class="btn btn-success" type="submit">Pesquisar</button>
    </form>

  </div>

  <div class="table-responsive shadow-sm " v-if="!carregamento">
    <table class="table border table-hover">
      <thead class="">
        <tr>
          <th scope="col">Nome do usuario</th>
          <th scope="col">Email</th>
          <th scope="col">Data de criação</th>
          <th scope="col">Ultima atualização</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, indice) in usuarios">
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.created_at }}</td>
          <td>{{ u.updated_at }}</td>
        </tr>

        <tr v-if="usuarios.length === 0">
          <td colspan="7" class="text-center py-3 text-muted">
            Nenhum usuario cadastrado.
          </td>
        </tr>
      </tbody>
    </table>
  </div>




</template>