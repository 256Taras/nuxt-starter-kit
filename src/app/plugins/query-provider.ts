import { VueQueryPlugin } from "@tanstack/vue-query";
import { defineNuxtPlugin } from "#imports";
import { createQueryClient } from "#src/common/api/query-client";

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = createQueryClient();

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });
});
