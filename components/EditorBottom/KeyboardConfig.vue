<template>
  <div>
    <div>
      <h2>LOAD JSON FIRST</h2>
      <v-text-field v-model="jsonURL" label="JSON URL"></v-text-field>
      <v-btn :disabled="isLoading" @click="jsonButtonClicked">load</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'

import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'

interface State {
  jsonURL: string
  isLoading: boolean
}

export default defineComponent({
  setup(_props, _context) {
    const state = reactive<State>({
      jsonURL:
        'https://gist.githubusercontent.com/hsgw/c57055b3fddb58bdc58dddaba5c087e4/raw/15da4f3b5e5b54761f33ec5c45b24e2950040677/meishi2.json',
      isLoading: false,
    })

    const { loadConfig, config } = useKeyboard()

    const jsonButtonClicked = async () => {
      try {
        state.isLoading = true
        config.keyboard = undefined
        const url = new URL(state.jsonURL)
        const res = await axios.get(url.toString())
        loadConfig(res.data, state.jsonURL)
      } catch (e) {
        console.error(e)
      } finally {
        state.isLoading = false
      }
    }
    return { ...toRefs(state), jsonButtonClicked }
  },
})
</script>
