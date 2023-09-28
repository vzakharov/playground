const appConfig = {
  app: {
    baseURL: '/playground/',
    buildAssetsDir: 'assets',
  },
};

const { NUXT_ENV } = process.env;

console.log({ NUXT_ENV, appConfig })

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  ...NUXT_ENV === 'production' && appConfig
})
