import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import GAuth from "vue3-google-oauth2";
createApp(App).use(router).mount("#app");
