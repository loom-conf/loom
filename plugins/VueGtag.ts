import { Context } from '@nuxt/types'
import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default ({ app }: Context) => {
  Vue.use(
    VueGtag,
    {
      config: {
        id: 'UA-192559961-1',
      },
    },
    app.router
  )
}
