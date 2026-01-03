<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/services/http';
import Swal from 'sweetalert2';

//variaveis de carregamentos
let loading = ref(false);
let carregamento = ref(true);

const router = useRouter();

const route = useRoute();

let lead = ref([]);

let obj = ref({
    'id': null,
    'nome': '',
    'numero': '',
    'plano': '',
    'mensalidade': null,
    'observacoes': ''
});

onMounted(() => {

    obj.value.id = route.params.id;
    // obj.value.id = 1;

    axiosInstance.get(`/leads/${obj.value.id}`)
    .then(response => {
        lead.value = response.data.data;

        obj.value.nome = lead.value.nome;
        obj.value.numero = lead.value.numero;
        obj.value.observacoes = lead.value.observacoes;

        carregamento.value = false;
    })
    .catch(error => {
        console.error('Erro: ', error);
        carregamento.value = false;
    })
});

function adicionar_cliente() {
    loading.value = true;

    // expressão regular para pegar so os numeros
    obj.value.numero = obj.value.numero.replace(/\D/g, '');
    obj.value.mensalidade = obj.value.mensalidade.replace(',', '.');

    axiosInstance.post('/clientes/', obj.value)
    .then(response => {
        Swal.fire({
            position: 'top-end',
            title: response.data.message,
            icon: 'success',
            toast: true,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        });
        router.push('/cliente')
    })
    .catch(error => {
        console.log("Erro: ", error);
        Swal.fire({
            title: 'Não foi possível atualizar',
            text: 'favor entrar em contato com o adm do sistema',
            icon: 'error',
            confirmButtonColor: '#000000',
            confirmButtonText: 'Ok'
        });
        loading.value = false;
    })
}





</script>

<template>
<div class="container">
    <h1 class="text-center text-black pt-5">Cadastre aqui seu novo cliente</h1>


    <div class="bg-body border p-3 shadow-sm">
        <form @submit.prevent="adicionar_cliente">
            <div class="mb-3">
                <label for="nome" class="form-label">Nome do lead</label>
                <input type="text" class="form-control" v-model="obj.nome" required>
            </div>

            <div class="mb-3">
                <label for="nome" class="form-label">Número</label>
                <input type="text" class="form-control"  v-mask="'(##) ####-####'" v-model="obj.numero" required>
            </div>

            <div class="mb-3">
                <label for="plano" class="form-label">Plano</label>
                <input type="text" class="form-control" v-model="obj.plano" placeholder="Preencha o plano do novo cliente" required>
            </div>

            <div class="mb-3">
                <label for="plano" class="form-label">Mensalidade</label>
                <input type="text" class="form-control" v-model="obj.mensalidade" placeholder="Preencha o valor da mensalidade" v-mask="'###,##'" required>
            </div>

            <div class="mb-3">
                <label for="1" class="form-label">Observações</label>
                <input type="text" class="form-control" v-model="obj.observacoes" placeholder="Adicione uma observação">
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loading"><span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>{{ loading ? "Cadastrando..." : "Cadastrar" }}</button>

        </form>
    </div>
</div>




</template>