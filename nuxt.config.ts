import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  srcDir: "src/",

  alias: {
    "#src": fileURLToPath(new URL("./src", import.meta.url)),
  },

  modules: ["@pinia/nuxt", "@nuxt/eslint", "@vueuse/nuxt", "@vee-validate/nuxt", "dayjs-nuxt", "@nuxtjs/color-mode"],

  // shadcn-vue dark mode: adds `.dark` class on <html>, with SSR-safe inline
  // script injected by the module (no FOUC). Preference persists to cookie.
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
    storageKey: "color-mode",
  },

  dir: {
    assets: "app/assets",
    layouts: "app/layouts",
    middleware: "app/middleware",
    pages: "app/pages",
    plugins: "app/plugins",
  },

  imports: { autoImport: false },

  components: { dirs: [] },

  typescript: { strict: true },

  css: ["~/app/assets/css/main.css"],

  // ─────────────────────────────────────────────────────────────────
  // App
  // ─────────────────────────────────────────────────────────────────
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },

  // ─────────────────────────────────────────────────────────────────
  // Dev
  // ─────────────────────────────────────────────────────────────────
  ssr: true,

  devtools: { enabled: isDev },

  devServer: {
    host: "localhost",
    port: 3000,
  },

  // ─────────────────────────────────────────────────────────────────
  // Experimental
  // ─────────────────────────────────────────────────────────────────
  experimental: {
    typedPages: true,
    viewTransition: true,
  },

  features: {
    devLogs: false,
    inlineStyles: false,
  },

  // ─────────────────────────────────────────────────────────────────
  // Vue
  // ─────────────────────────────────────────────────────────────────
  vue: {
    propsDestructure: true,
  },

  // ─────────────────────────────────────────────────────────────────
  // Vite
  // ─────────────────────────────────────────────────────────────────
  vite: {
    plugins: [tailwindcss()],

    server: {
      watch: {
        usePolling: false,
      },
    },

    define: {
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },

    resolve: {
      dedupe: ["vue", "vue-router", "pinia"],
    },

    build: {
      target: "esnext",
      minify: isProd ? "esbuild" : false,
      cssMinify: isProd ? "lightningcss" : false,
      cssCodeSplit: true,
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          chunkFileNames: isProd ? "chunks/[name]-[hash].js" : "chunks/[name].js",
          entryFileNames: isProd ? "entry/[name]-[hash].js" : "entry/[name].js",
          assetFileNames: isProd ? "assets/[name]-[hash].[ext]" : "assets/[name].[ext]",
        },
      },
    },

    optimizeDeps: {
      include: ["vue", "vue-router", "pinia", "@vueuse/core"],
    },

    esbuild: {
      treeShaking: true,
      legalComments: "none",
      minifyIdentifiers: isProd,
      minifySyntax: isProd,
      minifyWhitespace: isProd,
    },
  },

  // ─────────────────────────────────────────────────────────────────
  // Nitro
  // ─────────────────────────────────────────────────────────────────
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: false,
    },

    routeRules: {
      "/api/**": {
        cors: true,
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      },
      "/assets/images/**": {
        headers: { "Cache-Control": "public, max-age=31536000, immutable" },
      },
    },

    minify: isProd,
    sourceMap: false,
    timing: false,
  },

  // ─────────────────────────────────────────────────────────────────
  // Source maps
  // ─────────────────────────────────────────────────────────────────
  sourcemap: {
    server: false,
    client: false,
  },

  // ─────────────────────────────────────────────────────────────────
  // Runtime config
  // ─────────────────────────────────────────────────────────────────
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
      appName: process.env.NUXT_PUBLIC_APP_NAME || "Nuxt Starter Kit",
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3000",
      appEnv: process.env.NODE_ENV || "development",

      // Feature flags
      ffNewDashboard: process.env.NUXT_PUBLIC_FF_NEW_DASHBOARD || "false",
      ffBetaFeatures: process.env.NUXT_PUBLIC_FF_BETA_FEATURES || "false",
    },
  },
});
