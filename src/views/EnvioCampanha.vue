<script setup>
import axiosInstance from '@/services/http';
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';

// carregamento
let carregamento = ref(true);
// leads selecionados
let selecionados = ref([]);
// mensagem de disparo
let mensagem = ref('');

// iniciando variaveis
let leads = ref([]);
let leadsOriginal = ref([]);
let termoPesquisa = ref('');

onMounted(() => {
    axiosInstance.get('/leads/')
        .then(response => {
            leads.value = response.data.data;
            leadsOriginal.value = response.data.data;
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
        leads.value = leadsOriginal.value;
        return;
    }

    const termo = termoPesquisa.value.toLowerCase();
    leads.value = leadsOriginal.value.filter(lead =>
        lead.nome.toLowerCase().includes(termo) ||
        lead.numero.includes(termo)
    );
}

// selecionar lead
function selecionar(lead) {
    const index = selecionados.value.findIndex(l => l.id === lead.id);
    if (index > -1) {
        selecionados.value.splice(index, 1);
    } else {
        selecionados.value.push(lead);
    }
}

// Verificar se lead está selecionado
function estaSelecionado(lead) {
    return selecionados.value.some(l => l.id === lead.id);
}

// enviar para API
function enviarCampanha() {
    // verificações para não enviar
    if (selecionados.value.length === 0) {
        Swal.fire({
            title: 'Selecione pelo menos um lead',
            icon: 'warning',
        });
        return;
    }

    if (!mensagem.value.trim()) {
        Swal.fire({
            title: 'Digite a mensagem para envio',
            icon: 'warning',
        });
        return;
    }

    // preparar dados para o envio
    const dadosParaEnviar = {
        mensagem: mensagem.value, 
        leads: selecionados.value.map(lead => ({
            nome: lead.nome,
            numero: lead.numero,
            status: lead.status || 'ativo', 
            observacoes: lead.observacoes || ''
        }))
    };  

    // enviar dados para a api
    axiosInstance.post('/disparocampanha', dadosParaEnviar)
        .then(response => {
            Swal.fire({
                title: response.data.message,
                text: `${selecionados.value.length} leads enviados`,
                icon: 'success',
            });
            // aqui limpa após o envio
            selecionados.value = [];
            mensagem.value = '';

            console.log(response);
        })
        .catch(error => {
            console.log("Erro: ", error);
            Swal.fire({
                title: 'Não foi possível enviar',
                text: error.response?.data?.message || 'Erro no servidor',
                icon: 'error',
            });
        });
}
</script>

<template>
    <!-- tela de carregamento -->
    <div class="d-flex flex-column justify-content-center align-items-center vh-100" v-if="carregamento">
        <div class="spinner-border">
            <span class="visually-hidden">Aguarde...</span>
        </div>
    </div>

    <!-- cabeçalho -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Envio de campanha</h1>
        <div>
            <button @click="enviarCampanha" class="btn btn-success me-2" :disabled="selecionados.length === 0">
                <i class="bi bi-send"></i> Enviar ({{ selecionados.length }})
            </button>
        </div>
    </div>

    <!-- input da mensagem -->
    <div class="card mb-4">
        <div class="card-body">
            <h5 class="card-title">Mensagem da campanha</h5>
            <textarea 
                class="form-control" 
                v-model="mensagem" 
                placeholder="Digite a mensagem que será enviada para os leads..."
                rows="3"
            ></textarea>
            <small class="text-muted">Esta mensagem será enviada para todos os leads selecionados.</small>
        </div>
    </div>

    <!-- pesquisa -->
    <div class="d-flex align-items-center mb-3" v-if="!carregamento">
        <form class="d-flex w-100" role="search" @submit.prevent="pesquisar">
            <input class="form-control me-2" type="search" placeholder="Pesquisar por nome ou número..." v-model="termoPesquisa">
            <button class="btn btn-outline-success" type="submit">Pesquisar</button>
        </form>
    </div>

    <!-- tabela -->
    <div class="table-responsive shadow-sm" v-if="!carregamento">
        <table class="table border table-hover">
            <thead class="table-light">
                <tr>
                    <th scope="col">Nome do lead</th>
                    <th scope="col">Número</th>
                    <th scope="col">Selecionar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="l in leads" :key="l.id" :class="{ 'table-active': estaSelecionado(l) }">
                    <td>{{ l.nome }}</td>
                    <td>{{ l.numero }}</td>
                    <td>
                        <input 
                            class="form-check-input" 
                            type="checkbox" 
                            :checked="estaSelecionado(l)"
                            @change="selecionar(l)" 
                        />
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="leads.length === 0" class="text-center p-4">
            <p class="text-muted">Nenhum lead encontrado</p>
        </div>
    </div>
</template>