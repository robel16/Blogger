<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue"; // Import Navbar

const router = useRouter();
const email = ref("");
const password = ref("");
const registerEmail = ref("");
const registerPassword = ref("");
const registerUsername = ref("");
const isLogin = ref(true);
const error = ref("");
const isLoading = ref(false);
const isAuthenticated = ref(!!localStorage.getItem("token")); // Check if user is authenticated

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  error.value = "";
};

// Handle login via JWT
const handleLogin = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email: email.value,
      password: password.value,
    });
    
    const { token, username } = response.data; // Adjust based on your API response
    localStorage.setItem("token", token);
    localStorage.setItem("userName", username);
    router.push('/'); // Redirect to home or dashboard
  } catch (err) {
    console.error("Login error:", err); // More detailed error logging
    error.value = err.response?.data?.message || "Failed to login.";
  } finally {
    isLoading.value = false;
  }
};


// Save user to database via registration endpoint
const handleRegister = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    if (!registerEmail.value || !registerPassword.value || !registerUsername.value) {
      throw new Error("Please fill in all fields");
    }

    const response = await axios.post("http://localhost:5000/api/auth/register", {
      username: registerUsername.value,
      email: registerEmail.value,
      password: registerPassword.value,
    });

    const { token } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("userName", registerUsername.value);
    isAuthenticated.value = true; 
    alert("Registration successful!");
    router.push("/blogs"); 
  } catch (err) {
    console.error("Registration error:", err);
    error.value = err.response?.data?.message || "Failed to register.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <Navbar v-if="isAuthenticated" />

      <div id="forms">
        <!-- Login Form -->
        <div id="login-form" v-if="isLogin">
          <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="email">Email</label>
              <input
                v-model="email"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="password">Password</label>
              <input
                v-model="password"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>
            <div class="flex items-center justify-between">
              <button
                class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                :disabled="isLoading"
              >
                {{ isLoading ? "Loading..." : "Login" }}
              </button>
              <a
                @click.prevent="toggleForm"
                class="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-black cursor-pointer"
              >
                Create Account
              </a>
            </div>
          </form>
        </div>

        <!-- Register Form -->
        <div id="register-form" v-else>
          <h2 class="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form @submit.prevent="handleRegister">
            <div class="mb-4">
              <label class="block text-gray-700 font-bold mb-2" for="registerUsername">Username</label>
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
              <label class="block text-gray-700 font-bold mb-2" for="registerEmail">Email</label>
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
              <label class="block text-gray-700 font-bold mb-2" for="registerPassword">Password</label>
              <input
                v-model="registerPassword"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="registerPassword"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>
            <div class="flex items-center justify-between">
              <button
                :disabled="isLoading"
                class="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                type="submit"
              >
                {{ isLoading ? "Processing..." : "Sign Up" }}
              </button>
              <a
                @click.prevent="toggleForm"
                class="text-gray-600 hover:underline cursor-pointer"
              >
                Already have an account?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>