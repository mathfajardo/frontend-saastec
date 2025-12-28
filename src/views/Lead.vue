<script setup>
import axiosInstance from '@/services/http';
import { ref, onMounted, computed } from 'vue';


// carregamento
let carregamento = ref(true);

// iniciando array dos leads
let leads = ref([]);


// carregando os leads
onMounted(() => {

  axiosInstance.get('/leads/')
  .then(response => {
    leads.value = response.data.data;
    console.log("leads: ", leads.value[1]);
    carregamento.value = false;
  })
  .catch(error => {
    console.log('Erro: ', error)
    carregamento.value = false;
  })
})


// Lead selecionado para detalhes
const leadSelecionado = ref(null);
const modalVisivel = ref(false);

// Status disponíveis
const statusDisponiveis = ['Novo', 'Em atendimento', 'Convertido', 'Perdido'];

// Função para abrir modal com detalhes do lead
const abrirDetalhesLead = (lead) => {
  leadSelecionado.value = { ...lead };
  modalVisivel.value = true;
};

// Função para fechar modal
const fecharModal = () => {
  modalVisivel.value = false;
  leadSelecionado.value = null;
};

// Função para salvar alterações do lead
function salvarLead() {

  const index = leads.value.findIndex(l => l.id === leadSelecionado.value.id);
  if (index !== -1) {
    leads.value[index] = { ...leadSelecionado.value };
  }
  axiosInstance.put('/leads/' + leadSelecionado.value.id, leadSelecionado.value)
  .then(response => {
    Swal.fire({
      
    })
  })
  fecharModal();
};

// Função para mover lead entre colunas
const moverLead = (leadId, novoStatus) => {
  const lead = leads.value.find(l => l.id === leadId);
  if (lead) {
    lead.status = novoStatus;
  }
};

// Computed para organizar leads por status
const leadsPorStatus = computed(() => {
  const organizado = {};
  statusDisponiveis.forEach(status => {
    organizado[status] = leads.value.filter(lead => lead.status === status);
  });
  return organizado;
});

// Nomes amigáveis para os status
const nomesStatus = {
  'Novo': 'Novos',
  'Em atendimento': 'Em Atendimento',
  'Convertido': 'Convertidos',
  'Perdido': 'Perdidos'
};

// Cores para cada status
const coresStatus = {
  'Novo': 'bg-primary',
  'Em atendimento': 'bg-warning',
  'Convertido': 'bg-success',
  'Perdido': 'bg-danger'
};
</script>

<template>
  <div class="container-fluid">
    <!-- Cabeçalho -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0"><i class="bi bi-people"></i> Quadro de Leads</h1>
      <RouterLink to="/leadcadastro" class="btn btn-primary">
        <i class="bi bi-plus-circle"></i> Adicionar Lead
      </RouterLink>
    </div>

    <!-- Quadro Kanban -->
    <div class="kanban-board">
      <div class="row">
        <!-- Coluna para cada status -->
        <div 
          v-for="status in statusDisponiveis" 
          :key="status" 
          class="col-lg-3 col-md-6 mb-4"
        >
          <div class="card border-0 shadow-sm h-100">
            <!-- Cabeçalho da coluna -->
            <div class="card-header border-0 rounded-top" :class="coresStatus[status]">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0 text-white">
                  {{ nomesStatus[status] }}
                  <span class="badge bg-light text-dark ms-2">
                    {{ leadsPorStatus[status].length }}
                  </span>
                </h5>
              </div>
            </div>

            <!-- Lista de leads da coluna -->
            <div class="card-body p-3 kanban-column" :style="{ minHeight: '500px' }">
              <div 
                v-for="lead in leadsPorStatus[status]" 
                :key="lead.id"
                class="kanban-card mb-3"
                @click="abrirDetalhesLead(lead)"
                style="cursor: pointer;"
              >
                <div class="card border-0 shadow-sm hover-shadow">
                  <div class="card-body">
                    <div class="d-flex align-items-start">
                      <div class="flex-grow-1">
                        <h6 class="card-title mb-1">{{ lead.nome }}</h6>
                        <p class="card-text text-muted mb-2">
                          <i class="bi bi-telephone me-2"></i>{{ lead.numero }}
                        </p>
                        <small class="text-muted">
                          <i class="bi bi-clock me-1"></i>Última atualização: há 2 dias
                        </small>
                      </div>
                      <div class="dropdown">
                        <button 
                          class="btn btn-sm btn-link text-muted" 
                          type="button" 
                          @click.stop
                          data-bs-toggle="dropdown"
                        >
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li v-for="novoStatus in statusDisponiveis.filter(s => s !== status)" :key="novoStatus">
                            <a class="dropdown-item" @click.stop="moverLead(lead.id, novoStatus)">
                              Mover para {{ nomesStatus[novoStatus] }}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de detalhes do lead -->
  <div 
    class="modal fade" 
    :class="{ show: modalVisivel, 'd-block': modalVisivel }" 
    tabindex="-1" 
    v-if="modalVisivel"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Cabeçalho do modal -->
        <div class="modal-header azul1 text-white">
          <h5 class="modal-title">
            <i class="bi bi-person-circle me-2"></i>Detalhes do Lead
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="fecharModal"></button>
        </div>

        <!-- Corpo do modal -->
        <div class="modal-body" v-if="leadSelecionado">
          <div class="row">
            <!-- Informações básicas -->
            <div class="col-md-6 mb-3">
              <label class="form-label text-muted">Nome</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="leadSelecionado.nome"
              >
            </div>
            
            <div class="col-md-6 mb-3">
              <label class="form-label text-muted">Telefone</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="leadSelecionado.numero"
              >
            </div>

            <!-- Status -->
            <div class="col-12 mb-3">
              <label class="form-label text-muted">Status</label>
              <select class="form-select" v-model="leadSelecionado.status">
                <option v-for="status in statusDisponiveis" :key="status" :value="status">
                  {{ nomesStatus[status] }}
                </option>
              </select>
            </div>

            <!-- Observações -->
            <div class="col-12 mb-3">
              <label class="form-label text-muted">Observações</label>
              <textarea 
                class="form-control" 
                rows="4" 
                v-model="leadSelecionado.observacoes"
                placeholder="Adicione observações sobre o lead..."
              ></textarea>
            </div>

            <!-- Informações adicionais (fictícias) -->
            <div class="col-12">
              <div class="card border-0 bg-light">
                <div class="card-body">
                  <h6 class="card-subtitle mb-2 text-muted">Informações Adicionais</h6>
                  <div class="row small">
                    <div class="col-6">
                      <p class="mb-1"><i class="bi bi-calendar me-1"></i> Criado em: 15/05/2024</p>
                    </div>
                    <div class="col-6">
                      <p class="mb-1"><i class="bi bi-arrow-clockwise me-1"></i> Última atualização: Hoje</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rodapé do modal -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="fecharModal">
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="salvarLead">
            <i class="bi bi-save me-1"></i>Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay do modal -->
  <div 
    class="modal-backdrop fade" 
    :class="{ show: modalVisivel }" 
    v-if="modalVisivel"
    @click="fecharModal"
  ></div>
</template>

<style scoped>

</style>