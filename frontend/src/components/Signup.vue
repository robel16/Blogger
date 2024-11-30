<template>
  <div class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <div id="forms">
        <div id="login-form" v-if="isLogin">
          <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="username"
                >Username</label
              >
              <input
                v-model="username"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="password"
                >Password</label
              >
              <input
                v-model="password"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
              <a
                @click.prevent="toggleForm"
                class="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-black"
              >
                Forgot Password?
              </a>
            </div>
          </form>
          <p class="text-center mt-4">
            Don't have an account?
            <a @click.prevent="toggleForm" class="text-gray-500 hover:underline"
              >Sign Up</a
            >
          </p>
        </div>

        <div id="register-form" v-else>
          <h2 class="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form @submit.prevent="handleRegister">
            <div class="mb-4">
              <label
                class="block text-gray-700 font-bold mb-2"
                for="registerUsername"
                >Username</label
              >
              <input
                v-model="registerUsername"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="registerUsername"
                type="text"
                placeholder="Username"
                required
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-gray-700 font-bold mb-2"
                for="registerEmail"
                >Email</label
              >
              <input
                v-model="registerEmail"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="registerEmail"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-gray-700 font-bold mb-2"
                for="registerPassword"
                >Password</label
              >
              <input
                v-model="registerPassword"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="registerPassword"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p class="text-center mt-4">
            Already have an account?
            <a @click.prevent="toggleForm" class="text-gray-600 hover:underline"
              >Login</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const registerUsername = ref("");
const registerEmail = ref("");
const registerPassword = ref("");
const isLogin = ref(true);

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

const handleLogin = () => {
  console.log("Login:", { username: username.value, password: password.value });
};

const handleRegister = () => {
  console.log("Register:", {
    username: registerUsername.value,
    email: registerEmail.value,
    password: registerPassword.value,
  });
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
