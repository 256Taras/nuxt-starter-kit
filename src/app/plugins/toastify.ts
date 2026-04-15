import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { defineNuxtPlugin } from "#imports";

const TOAST_AUTO_CLOSE_MS = 3000;

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: TOAST_AUTO_CLOSE_MS,
    position: "top-right",
    theme: "light",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
  } as ToastContainerOptions);
});
