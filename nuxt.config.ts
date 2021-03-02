import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    htmlAttrs: {
      lang: 'us',
      prefix: 'og: http://ogp.me/ns#',
    },
    titleTemplate: 'LOOM',
    title: 'LOOM',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'LOOM Configurator is a keymap editor for keyboards made with QMK Firmware.',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'LOOM Configurator',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://loom-conf.github.io/',
      },
      { hid: 'og:title', property: 'og:title', content: 'Loom Configurator' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'LOOM Configurator is a keymap editor for keyboards made with QMK Firmware.',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://loom-conf.github.io/ogp.png',
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/css/ress.scss',
    '@/assets/css/main.scss',
    '@/assets/css/keytop.scss',
    '@/assets/css/tooltip.scss',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['@/plugins/VTooltip'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/composition-api',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  styleResources: {
    scss: ['~/assets/css/variables.scss'],
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  // Router Configuration
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'kbd',
        path: '/kbd/:keyboard',
        component: resolve(__dirname, 'pages/index.vue'),
      })
    },
  },
}

export default config
