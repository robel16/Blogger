<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router"; // Import useRoute
import Navbar from "./components/Navbar.vue";
import { RouterView } from "vue-router";

const isAuthenticated = ref(!!localStorage.getItem("token"));
const route = useRoute(); // Get the current route

const handleLogout = () => {
  isAuthenticated.value = false; // Update the authentication state
};

</script>

<template>
  <!-- Conditionally render Navbar based on the route -->
  <Navbar v-if="route.path !== '/signup'" :isAuthenticated="isAuthenticated" @logout="handleLogout" />
  
  <router-view />
</template>