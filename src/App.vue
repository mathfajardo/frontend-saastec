<script setup>

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './assets/global.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import BarraNavegacao from './components/BarraNavegacao.vue';

</script>

<template>
  <div class="bg-body-secondary min-vh-100">
    <BarraNavegacao />
    <main style="margin-left: 250px" class="p-4">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
