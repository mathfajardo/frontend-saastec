<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axiosInstance from '@/services/http';
import Swal from 'sweetalert2';

// inicianco router
const router = useRouter();

// variavel de loading
let loading = ref(false);

// objeto para ser enviado no post
let obj = ref({
    'id': null,
    'nome': '',
    'numero': '',
    'status': '',
    'observacoes': ''
});

function cadastrar_lead() {
    loading.value = true;
    
    axiosInstance.post('/leads/', obj.value)
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
        router.push('/lead');
    })
    .catch(error => {
        console.error("Erro: ", error);
        Swal.fire({
            title: error.data.message,
            text: 'favor entrar em contato com o adm do sistema',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        loading.value = false;
    })

}

</script>

<template>
<div class="container">
    <h1 class="text-center text-black pt-5">Cadastro</h1>


    <div class="bg-body border p-3 shadow-sm">
        <form @submit.prevent="cadastrar_lead">
            <div class="mb-3">
                <label for="nome" class="form-label">Nome do lead</label>
                <input type="text" class="form-control" v-model="obj.nome">
            </div>

            <div class="mb-3">
                <label for="nome" class="form-label">Número</label>
                <input type="text" class="form-control" v-model="obj.numero" v-mask="'(##) #####-####'">
            </div>

            <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select class="form-select" id="status" v-model="obj.status">
                    <option selected>Selecione uma opção</option>
                    <option value="Novo">Novos</option>
                    <option value="Em atendimento">Em atendimento</option>
                    <option value="Convertido">Convertidos</option>
                    <option value="Perdido">Perdidos</option>
                </select>
            </div>

            <div class="mb-3">
                <label for="1" class="form-label">Observações</label>
                <input type="text" class="form-control" v-model="obj.observacoes">
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loading"><span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>{{ loading ? "Cadastrando..." : "Cadastrar" }}</button>

        </form>
    </div>
</div>




</template>