// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  ...process.env.NODE_ENV === 'production' && {
    app: {
      baseURL: '/playground/',
      buildAssetsDir: 'assets',
    },
  }
})
