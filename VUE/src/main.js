/**
 * @file Documento para renderizar las vistas del frontend
 * @author Daniel Gomez Rodriguez
 * @since 02.10.2021
 */
 import { createApp } from "vue";
 import App from "./App.vue";
 import router from "./router";
 import store from "./store";
 import "bootstrap";
 import "bootstrap/dist/css/bootstrap.min.css";
 import { FontAwesomeIcon } from './plugins/font-awesome'
 
 createApp(App)
   .use(router)
   .use(store)
   .component("font-awesome-icon", FontAwesomeIcon)
   .mount("#app");
