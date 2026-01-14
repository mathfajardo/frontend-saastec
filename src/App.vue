<script setup>

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './assets/global.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'tippy.js/dist/tippy.css'

import BarraNavegacao from './components/BarraNavegacao.vue';
import { useRoute } from 'vue-router';
import { computed, ref} from 'vue';

const route = useRoute();
const collapsed = ref(false);

const esconderNav = computed (() => {
  return route.meta.esconderNav || false;
});

const tirarMargin = computed (() => {
  if (esconderNav.value) return "";
  return collapsed.value ? "margin-left: 70px" : "margin-left: 250px";
});

const atualizarCollapsed = (valor) => {
  collapsed.value = valor;
};

</script>

<template>
  <div class="bg-body-secondary min-vh-100">
    <BarraNavegacao v-if="!esconderNav" @toggle-collapsed="atualizarCollapsed" />
    <main :style="tirarMargin" class="p-4">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
