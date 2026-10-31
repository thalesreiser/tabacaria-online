const isDev = process.env.NODE_ENV !== "production"

export default defineNuxtConfig({
  compatibilityDate: "2026-10-01",
  devtools: { enabled: isDev },
  modules: ["@pinia/nuxt", "nuxt-security", "@nuxtjs/i18n"],
  typescript: { strict: true, typeCheck: false },
  runtimeConfig: {
    public: {
      // Overridden by NUXT_PUBLIC_API_URL, NUXT_PUBLIC_PUBLISHABLE_KEY and NUXT_PUBLIC_SENTRY_DSN.
      apiUrl: isDev ? "http://localhost:9000" : "",
      publishableKey: isDev ? "pk_dev_placeholder" : "",
      sentryDsn: "",
    },
  },
  i18n: {
    defaultLocale: "pt-BR",
    strategy: "no_prefix",
    locales: [{ code: "pt-BR", language: "pt-BR", file: "pt-BR.json", name: "Português (Brasil)" }],
  },
})
