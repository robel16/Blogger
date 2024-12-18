<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const formData = ref({
  username: '',
  email: '',
  password: ''
});

const handleRegister = async () => {
  try {
    await auth.register(formData.value);
    alert('Registration successful! Please login.');
    router.push('/login');
  } catch (error) {
    console.error('Registration error:', error);
    alert(error.response?.data?.message || 'Registration failed');
  }
};
</script>

<template>
  <form @submit.prevent="handleRegister">
    <!-- Your registration form fields -->
  </form>
</template> 