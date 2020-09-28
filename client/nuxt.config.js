const path = require('path');
const DOTENV_CONFIG = {
  only: ['API_URL'],
  path: path.join(__dirname, '../.env'),
};
require('dotenv').config(DOTENV_CONFIG);

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#454545' },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/main.css',
    'quill/dist/quill.core.css',
    'quill/dist/quill.snow.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~plugins/quill-plugin', ssr: false }],
  router: {
    middleware: ['auth'],
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    [
      'nuxt-fontawesome',
      {
        component: 'fa', // customize component name
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['faMinus', 'faPlus', 'faTimes', 'faGripVertical'],
          },
        ],
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    ['@nuxtjs/dotenv', { ...DOTENV_CONFIG, path: path.join(__dirname, '../') }],
  ],
  axios: {
    baseURL: process.env.API_URL,
  },
  auth: {
    redirect: {
      login: '/sign-in',
      logout: '/sign-in',
      home: '/',
      callback: '/sign-in',
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: 'auth', method: 'post', propertyName: 'token' },
          user: { url: 'users/me', method: 'get', propertyName: false },
          logout: false,
        },
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    postcss: {
      plugins: {
        'postcss-nested': {},
      },
      preset: {
        features: {
          customProperties: false,
        },
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
