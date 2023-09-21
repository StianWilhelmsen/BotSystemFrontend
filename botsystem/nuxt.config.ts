// nuxt.config.ts
export default {
  // Other Nuxt.js configuration...
  router: {

  },
    // Other Nuxt.js configuration...
    plugins: [
      // Other plugins...
      '~/plugins/localStorage.js', // No need to specify mode: 'client' here
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'
      }
    ],
    // Other Nuxt.js configuration...
  }