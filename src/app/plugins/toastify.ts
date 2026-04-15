import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/styles";
import { defineNuxtPlugin } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000,
    position: "top-right",
    theme: "light",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  } as ToastContainerOptions);
});
