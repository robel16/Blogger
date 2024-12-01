import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { auth } from "./firebase/config";

// Create a factory function for the app
const createMyApp = () => {
  const app = createApp(App);
  app.use(router);
  return app;
};

// Create app instance
const app = createMyApp();

// Initialize auth state once
let initialized = false;
auth.onAuthStateChanged(() => {
  if (!initialized) {
    app.mount('#app');
    initialized = true;
  }
});
