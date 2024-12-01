// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/config';
import Navbar from "@/components/Navbar.vue";
import Signup from "@/components/Signup.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Navbar,
    meta: { requiresAuth: true }
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: { requiresGuest: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  if (requiresAuth && !currentUser) {
    next('/signup');
  } else if (requiresGuest && currentUser) {
    next('/');
  } else {
    next();
  }
});

export default router;
