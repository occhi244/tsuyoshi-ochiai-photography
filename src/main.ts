import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { StateKey } from "./store";

createApp(App)
  .use(store, StateKey)
  .use(router)
  .mount("#app");
