// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
          title: 'Nuxt 3 ChatGPT API Demo',
          link: [{ rel: 'icon', type: 'image/*', href: '/favicon.svg' }],
          script: [{
            src: 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'
          }]
        }
      },
      meta: {
        title: 'Nuxt 3 ChatGPT API Demo',
        description: 'Nuxt 3 ChatGPT API'
      },
      runtimeConfig: {
        public:{
            OPENAI_API_KEY: process.env.OPENAI_API_KEY
        }
    },
    css: ['~/assets/css/main.css'],
    modules: [
        '@vueuse/nuxt',
      ],
    postcss: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
})
