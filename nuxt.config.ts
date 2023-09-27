// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  app: {
    baseURL: process.env.BASE_URL ?? '/',
    buildAssetsDir: 'assets',
  },
  // routeRules: {
  //   // Redirect root to /jobgenie
  //   '/': {
  //     redirect: '/jobgenie',
  //   },
  // },
  // (Doesn't work with statically generated pages)
})
