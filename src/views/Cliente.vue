<script setup>
import { onMounted, ref } from 'vue';
import axiosInstance from '@/services/http';
import Swal from 'sweetalert2'

    // iniciando o array produtos
    let clientes = ref([]);
    let clientesOriginal = ref([]);
    let termoPesquisa = ref('');

    // carregamento
    let carregamento = ref(true);

    onMounted(() => {
        axiosInstance.get('/clientes/')
        .then(response => {
          clientes.value = response.data.data;
          clientesOriginal.value = response.data.data;
          carregamento.value = false;
        })
        .catch(error => {
          console.error('Erro: ', error);
          carregamento.value = false;
        })
    });

    // função para remover
    function remover(cliente) {

      axiosInstance.delete(`/clientes/${cliente.id}`)
      .then((response) => {
        clientes.value = clientes.value.filter(c => c.id !== cliente.id);
        clientesOriginal.value = clientesOriginal.value.filter(c => c.id !== cliente.id);
        console.log(response.data);
        Swal.fire({
          title: 'Produto removido com sucesso!',
          icon: 'success',
          confirmButtonColor: '#000000',
          confirmButtonText: 'Ok'
        });
      })
      .catch(error => {
        console.error('Erro: ', error);
        Swal.fire({
          title: 'Não foi possível deletar',
          text: 'favor entrar em contato com o adm do sistema',
          icon: 'error',
          confirmButtonColor: '#000000',
          confirmButtonText: 'Ok'
        });
      })
    }

    // pesquisar
    function pesquisar() {
      if (!termoPesquisa.value.trim()) {
        clientes.value = clientesOriginal.value;
        return;
      }

      const termo = termoPesquisa.value.toLowerCase();
      clientes.value = clientesOriginal.value.filter(cliente =>
        cliente.nome.toLowerCase().includes(termo) //||
        // cliente.categoria.toLowerCase().includes(termo) ||
        // cliente.valor_produto.toLowerCase().includes(termo)
      );

      termoPesquisa.value = '';
    }


</script>

<template>

<!-- tela de carregamento -->
  <div
      class="d-flex flex-column justify-content-center align-items-center vh-100"
      v-if="carregamento"
  >
      <div class="spinner-border">
          <span class="visually-hidden">Aguarde...</span>
      </div>
  </div>

<!-- Cabeçalho -->
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="mb-0"><i class="bi bi-person"></i> Lista de clientes</h1>
    <RouterLink to="/leadcadastro" class="btn btn-primary">
      <i class="bi bi-plus-circle"></i> Adicionar Cliente
    </RouterLink>
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
        <th scope="col">Nome do cliente</th>
        <th scope="col">Numero</th>
        <th scope="col">Plano</th>
        <th scope="col">Editar</th>
        <th scope="col">Deletar</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(c, indice) in clientes">
        <td>{{ c.nome }}</td>
        <td>{{ c.numero }}</td>
        <td>{{ c.plano }}</td>
        <td><RouterLink class="btn btn-outline-primary" :to="`/editarprodutos/${c.id}`">Editar</RouterLink></td>
        <td><button class="btn btn-outline-danger" @click="remover(c)">Deletar</button></td>
      </tr>

      <tr v-if="clientes.length === 0">
        <td colspan="5" class="text-center py-3 text-muted">
          Nenhum cliente encontrado.
        </td>
      </tr>
    </tbody>
  </table>
</div>




</template>