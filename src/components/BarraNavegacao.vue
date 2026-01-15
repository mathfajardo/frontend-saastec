<script setup>
import Swal from 'sweetalert2';
import {ref, computed, defineEmits} from 'vue';
import { useAuth } from '@/stores/auth';
import { useRouter } from 'vue-router';

const emit = defineEmits(['toggle-collapsed']);

const collapsed = ref(false);

const sidebarWidth = computed(() => {
    return collapsed.value ? '70px' : '250px'
});

const toggleSidebar = () => {
    collapsed.value = !collapsed.value;
    emit('toggle-collapsed', collapsed.value);
}

// função de logout
const auth = useAuth();
const router = useRouter();


async function fazerLogout() {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Logout realizado',
    confirmButtonColor: '#000000',
    showConfirmButton: false,
    toast: true,
    timer: 2000,
    timerProgressBar: true
  });
  await auth.logout();
  router.push('/');
}



</script>

<template>
  <div class="sidebar azul1" :style="{ width: sidebarWidth }">
    <h1 class="text-center py-3 mb-4 border-bottom">
      <span v-if="collapsed" class="d-flex flex-column align-items-center">
        <div>P</div>
      </span>
      <span v-else class="fs-4">Painel</span>
    </h1>

    <div class="px-3">
      <RouterLink to="/home" class="nav-link py-2" active-class="text-primary bg-light"><i class="bi bi-house-door-fill"></i> <span v-if="!collapsed">Home</span></RouterLink>
      <RouterLink to="/lead" class="nav-link py-2" active-class="text-primary bg-light"><i class="bi bi-person-fill-add"></i> <span v-if="!collapsed">Leads</span></RouterLink>
      <RouterLink to="/cliente" class="nav-link py-2" active-class="text-primary bg-light"><i class="bi bi-person-heart"></i> <span v-if="!collapsed">Clientes</span></RouterLink>
      <RouterLink to="/usuario" class="nav-link py-2" active-class="text-primary bg-light"><i class="bi bi-person-fill"></i> <span v-if="!collapsed">Usuarios</span></RouterLink>
      <RouterLink to="/enviocampanha" class="nav-link py-2" active-class="text-primary bg-light"><i class="bi bi-fire"></i> <span v-if="!collapsed">Campanhas (beta)</span></RouterLink>
      <a class="nav-link py-2 text-danger" @click.prevent="fazerLogout" style="cursor: pointer;"><i class="bi bi-box-arrow-right"></i> <span v-if="!collapsed">Sair</span></a>
    </div>

    <span
      class="collapse-icon"
      :class="{ 'rotate-180': collapsed }"
      @click="toggleSidebar"
    >
      <i class="bi bi-chevron-left"></i>
    </span>
  </div>
</template>

<style scoped>
.sidebar {
  color: white;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.nav-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 5px;
  margin-bottom: 5px;
  padding-left: 15px !important;
  transition: all 0.3s;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
}

.collapse-icon {
  position: absolute;
  bottom: 20px;
  right: 10px;
  padding: 10px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.3s;
}

.collapse-icon:hover {
  color: white;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>