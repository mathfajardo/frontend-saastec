<script setup>
import {ref, computed} from 'vue';


const collapsed = ref(false);

const sidebarWidth = computed(() => {
    return collapsed.value ? '70px' : '250px'
});

const toggleSidebar = () => {
    collapsed.value = !collapsed.value;
}



</script>

<template>
  <div class="sidebar azul1" :style="{ width: sidebarWidth }">
    <h1 class="text-center py-3 mb-4 border-bottom">
      <span v-if="collapsed" class="d-flex flex-column align-items-center">
        <div>V</div>
        <div>S</div>
      </span>
      <span v-else class="fs-4">CRM REPSAAS</span>
    </h1>

    <div class="px-3">
      <RouterLink to="/" class="nav-link py-2"><i class="bi bi-house-door"></i> <span v-if="!collapsed">Home</span></RouterLink>
      <RouterLink to="/lead" class="nav-link py-2"><i class="bi bi-person-fill-add"></i> <span v-if="!collapsed">Leads</span></RouterLink>
      <RouterLink to="/cliente" class="nav-link py-2"><i class="bi bi-person-heart"></i> <span v-if="!collapsed">Clientes</span></RouterLink>
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