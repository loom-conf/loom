<template>
  <div>
    <div class="mt-4">
      <h2>1.Load keyboard config</h2>
      <v-text-field v-model="jsonURL" label="JSON URL"></v-text-field>
      <v-btn :disabled="isLoading" @click="jsonButtonClicked">load</v-btn>
      <h3 v-if="hasConfig">Loaded - {{ configName }}</h3>
    </div>
    <div class="mt-4">
      <h2>2.Connect USB device</h2>
      <v-btn :disabled="!hasConfig || isConnected" @click="connectButtonClicked"
        >connect</v-btn
      >
      <h3 v-if="isConnected">Connected - {{ deviceName }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'

import { useKeyboard } from '@/stores/useKeyboard'
import { useEditor } from '@/stores/useEditor'

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

    const {
      connectDevice,
      loadKeyboardConfig,
      hasConfig,
      isConnected,
      config,
      setting,
    } = useKeyboard()

    const { setDeviceSetting } = useEditor()

    const jsonButtonClicked = async () => {
      try {
        state.isLoading = true
        const url = new URL(state.jsonURL)
        const res = await axios.get(url.toString())
        loadKeyboardConfig(res.data, state.jsonURL)
      } catch (e) {
        console.error(e)
      } finally {
        state.isLoading = false
      }
    }

    const connectButtonClicked = async () => {
      try {
        await connectDevice()
        setDeviceSetting(setting.device)
      } catch (e) {
        console.error(e)
      }
    }

    const configName = computed(() => config.keyboard?.name)
    const deviceName = computed(() => config.device?.name)

    return {
      ...toRefs(state),
      hasConfig,
      isConnected,
      jsonButtonClicked,
      connectButtonClicked,
      configName,
      deviceName,
    }
  },
})
</script>
