<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import axiosInstance from '@/services/http';

const carregamento = ref(true);

// variavel para armazenar os dados
let totalLeadsMes = ref(0);
let totalClientesMes = ref(0);
let totalClientes = ref(0);
let totalLeadsMesTodos = ref([]);

onMounted(() => {
  

  Promise.all([
    axiosInstance.get('/leadsMes'),
    axiosInstance.get('/clientesMes'),
    axiosInstance.get('/clientesTotal'),
    axiosInstance.get('/leadsMesTodos')
  ])
  .then(responses => {
    totalLeadsMes.value = responses[0].data.data.total;
    totalClientesMes.value = responses[1].data.data.total;
    totalClientes.value = responses[2].data.data.total;

    const meses = responses[3].data.data[0];
    totalLeadsMesTodos.value = Object.values(meses);
    histogramData.value.datasets[0].data = totalLeadsMesTodos.value;
  })
  .catch(error => {
    console.log('Erro: ', error);
  })
  .finally(() =>{
    carregamento.value = false;
    createHistogram();
  }) 
});

// Dados fictícios para o histograma
const histogramData = ref({
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  datasets: [{
    label: 'Leads por Mês',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: 'rgba(59, 130, 246, 1)',
    borderWidth: 1
  }]
});

let histogramChart = null;

const createHistogram = () => {
  const ctx = document.getElementById('histogramChart');
  
  if (histogramChart) {
    histogramChart.destroy();
  }
  
  histogramChart = new Chart(ctx, {
    type: 'bar',
    data: histogramData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Distribuição de Leads por Mês'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10
          },
          title: {
            display: true,
            text: 'Quantidade de Leads'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Meses'
          }
        }
      }
    }
  });
};
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

    <!-- titulo da pagina -->
  <h1 class="mb-5" v-if="!carregamento"><i class="bi bi-house-door"></i> Home</h1>

  <!-- cards -->
  <div class="d-flex flex-wrap gap-4 mt-5" v-if="!carregamento">
    <div class="card border-0 rounded-4" style="width: 20rem;">
      <div class="card-body p-4 text-center">
        <div class="d-flex justify-content-center mb-3">
          <i class="bi bi-person-up display-4"></i>
        </div>
        <h5 class="card-title text-white-75 fw-semibold mb-3">Leads no mês</h5>
        <h3 class="card-text display-4 fs-1 fw-bold">{{ totalLeadsMes}}</h3>
      </div>
    </div>

    <div class="card border-0 rounded-4" style="width: 20rem;">
      <div class="card-body p-4 text-center">
        <div class="d-flex justify-content-center mb-3">
          <i class="bi bi-person-check display-4"></i>
        </div>
        <h5 class="card-title text-white-75 fw-semibold mb-3">Clientes novos no mês</h5>
        <h3 class="card-text display-4 fs-1 fw-bold">{{ totalClientesMes }}</h3>
      </div>
    </div>

    <div class="card border-0 rounded-4" style="width: 20rem;">
      <div class="card-body p-4 text-center">
        <div class="d-flex justify-content-center mb-3">
          <i class="bi bi-person display-4"></i>
        </div>
        <h5 class="card-title text-white-75 fw-semibold mb-3">Total de clientes</h5>
        <h3 class="card-text display-4 fs-1 fw-bold">{{  totalClientes }}</h3>
      </div>
    </div>
  </div>

  <!-- Histograma Chart.js -->
  <div class="card mt-5 border-0 rounded-4 shadow-sm" v-show="!carregamento">
    <div class="card-body">
      <div class="chart-container" style="position: relative; height: 400px;">
        <canvas id="histogramChart"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>