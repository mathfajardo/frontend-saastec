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
    'plano': '',
    'mensalidade': '',
    'observacoes': ''
});

function cadastrar_cliente() {
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
        router.push('/cliente');
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
    <h1 class="text-center text-black pt-5">Cadastrar cliente</h1>


    <div class="bg-body border p-3 shadow-sm">
        <form @submit.prevent="cadastrar_cliente">
            <div class="mb-3">
                <label for="nome" class="form-label">Nome do cliente</label>
                <input type="text" class="form-control" v-model="obj.nome" placeholder="Digite o nome do cliente..." required>
            </div>

            <div class="mb-3">
                <label for="nome" class="form-label">Número</label>
                <input type="text" class="form-control" v-model="obj.numero" v-mask="'(##) ####-####'" placeholder="Número sem 9 na frente..." required>
            </div>

            <div class="mb-3">
                <label for="nome" class="form-label">Plano</label>
                <input type="text" class="form-control" v-model="obj.plano" placeholder="Digite o plano do cliente..." required>
            </div>
             
            <div class="mb-3">
                <label for="nome" class="form-label">Mensalidade</label>
                <input type="text" class="form-control" v-model="obj.mensalidade" placeholder="Preencha o valor da mensalidade" v-mask="'###,##'" required>
            </div>

            <div class="mb-3">
                <label for="1" class="form-label">Observações</label>
                <input type="text" class="form-control" v-model="obj.observacoes" placeholder="Digite aqui sua observação...">
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loading"><span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>{{ loading ? "Cadastrando..." : "Cadastrar" }}</button>

        </form>
    </div>
</div>




</template>