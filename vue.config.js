module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import '@/assets/scss/partials/variables.scss';
          @import '@/assets/scss/partials/helpers.scss';
          @import '@/assets/scss/main.scss';
        `
      }
    }
  }
}