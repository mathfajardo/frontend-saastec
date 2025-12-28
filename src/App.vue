<script setup>

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import './assets/global.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import BarraNavegacao from './components/BarraNavegacao.vue';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';

const route = useRoute();

let marginLogin = ref('');
const esconderNav = computed (() => {


  marginLogin.value = esconderNav ? "margin-left: 250" : "margin-left: 0";
  return route.meta.esconderNav || false;
});


</script>

<template>
  <div class="bg-body-secondary min-vh-100">
    <BarraNavegacao v-if="!esconderNav" />
    <main :style="marginLogin" class="p-4">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
