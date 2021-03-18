import Vue from 'vue'
import VueGtag from 'vue-gtag'

Vue.use(VueGtag, {
  config: {
    id: 'UA-192559961-1',
  },
})

declare global {
  interface Window {
    gtag: VueGtag
  }
}
