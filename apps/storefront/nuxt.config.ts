import tailwindcss from "@tailwindcss/vite"

const isDev = process.env.NODE_ENV !== "production"

export default defineNuxtConfig({
  compatibilityDate: "2026-10-01",
  devtools: { enabled: isDev },
  modules: ["@pinia/nuxt", "nuxt-security", "@nuxtjs/i18n", "shadcn-nuxt"],
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  shadcn: { prefix: "", componentDir: "./components/ui" },
  app: {
    head: {
      htmlAttrs: { lang: "pt-BR" },
      title: "Stray Dog Tabacaria",
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
  typescript: { strict: true, typeCheck: false },
  runtimeConfig: {
    public: {
      // Overridden by NUXT_PUBLIC_API_URL, NUXT_PUBLIC_PUBLISHABLE_KEY and NUXT_PUBLIC_SENTRY_DSN.
      apiUrl: isDev ? "http://localhost:9000" : "",
      publishableKey: isDev ? "pk_dev_placeholder" : "",
      sentryDsn: "",
      // Legal data shown in the footer. Supplied by the legal team, never written in the code
      // (FE-11.2); empty values are not rendered. Overridden by NUXT_PUBLIC_STORE_*.
      store: {
        legalName: "",
        cnpj: "",
        address: "",
        support: "",
        minorsNotice: "",
      },
    },
  },
  i18n: {
    defaultLocale: "pt-BR",
    strategy: "no_prefix",
    locales: [{ code: "pt-BR", language: "pt-BR", file: "pt-BR.json", name: "Português (Brasil)" }],
  },
})
