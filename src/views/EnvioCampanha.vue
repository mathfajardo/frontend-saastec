<script setup>
import axiosInstance from '@/services/http';
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import { computed } from 'vue';

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
let ordenarPor = ref('nome');
let ordemCrescente = ref(true);
let quantidadePorPagina = ref(10);
let paginaAtual = ref(1);

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
    paginaAtual.value = 1
}

// ordenação
const leadsOrdenadosEPaginados = computed(() => {
    // ordenar
    let resultado = [...leads.value].sort((a, b) => {
        let valorA = a[ordenarPor.value];
        let valorB = b[ordenarPor.value];

        valorA = valorA.toLowerCase();
        valorB = valorB.toLowerCase();

        if (valorA < valorB) return ordemCrescente.value ? -1 : 1;
        if (valorA > valorB) return ordemCrescente.value ? 1 : -1;
        return 0;
    });

    const inicio = (paginaAtual.value - 1) * quantidadePorPagina.value;
    const fim = inicio + quantidadePorPagina.value;

    return resultado.slice(inicio, fim);
})

function ordenar(campo) {
    if (ordenarPor.value === campo) {
        ordemCrescente.value = !ordemCrescente.value;
    } else {
        ordenarPor.value = campo;
        ordemCrescente.value = true;
    }
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

    <!-- seção do seletor -->
     <div class="d-flex justify-content-between align-items-center mb-3" v-if="!carregamento">
        <!-- seletor -->
        <div class="d-flex align-items-center">
            <span class="me-2">Mostrar:</span>
            <select class="form-select form-select-sm w-auto" v-model="quantidadePorPagina">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option :value="leads.length">Todos</option>
            </select>
            <span class="ms-2 text-muted">
                {{ Math.min((paginaAtual - 1) * quantidadePorPagina + 1, leads.length) }} -
                {{ Math.min(paginaAtual * quantidadePorPagina, leads.length) }}
                de {{ leads.length }} registros
            </span>
        </div>

        <!-- paginação -->
        <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-secondary me-2" @click="paginaAtual--" :disabled="paginaAtual <= 1">
                Anterior
            </button>
            <span class="mx-2">Página {{ paginaAtual }} de {{ Math.ceil(leads.length / quantidadePorPagina) }}</span>
            <button class="btn btn-sm btn-outline-secondary me-2" @click="paginaAtual++" :disabled="paginaAtual >= Math.ceil(leads.length / quantidadePorPagina)">
                Proxima
            </button>
        </div>
     </div>

    <!-- tabela -->
    <div class="table-responsive shadow-sm" v-if="!carregamento">
        <table class="table border table-hover">
            <thead class="table-light">
                <tr>
                    <th scope="col" style="cursor: pointer;" @click="ordenar('nome')">
                        Nome do lead
                        <span v-if="ordenarPor === 'nome'">
                            <i :class="ordemCrescente ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                        </span>
                    </th>
                    <th scope="col" style="cursor: pointer;" @click="ordenar('numero')">
                        Número
                        <span v-if="ordenarPor === 'numero'">
                            <i :class="ordemCrescente ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                        </span>
                    </th>
                    <th scope="col" style="cursor: pointer;" @click="ordenar('status')">
                        Status
                        <span v-if="ordenarPor === 'status'">
                            <i :class="ordemCrescente ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                        </span>
                    </th>
                    <th scope="col">Selecionar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="l in leadsOrdenadosEPaginados" :key="l.id" :class="{ 'table-active': estaSelecionado(l) }">
                    <td>{{ l.nome }}</td>
                    <td>{{ l.numero }}</td>
                    <td>{{ l.status }}</td>
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