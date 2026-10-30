// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'DipCheck – Wassertemperatur bayerischer Gewässer',
      meta: [
        {
          name: 'description',
          content: 'Wassertemperatur bayerischer Gewässer jeden Morgen per E-Mail.'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      // local: http://localhost:8080, set NUXT_PUBLIC_API_BASE=https://api.dipcheck.de for the prod build
      apiBase: 'http://localhost:8080'
    }
  }
})
