import type { Plugin } from '@nuxt/types'

const plugin: Plugin = ({ $config }, inject) => {
  return inject('features', {
    // FEATURE_NAME: $config.appEnv !== 'production',
    MESSAGES_PAGE: $config.appEnv !== 'production',
  })
}

export default plugin
