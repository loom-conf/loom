<template>
  <div>
    <div>
      <h2>JSON</h2>
      <v-text-field v-model="jsonURL" label="JSON URL"></v-text-field>
      <v-btn @click="handleJSONClick">load</v-btn>
    </div>
    <div class="my-4">
      <h2>USB</h2>
      <v-btn @click="handleUSBClick">Connect</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'

interface State {
  jsonURL: string
}

export default defineComponent({
  setup(_props, context) {
    const state = reactive<State>({
      jsonURL:
        'https://gist.githubusercontent.com/hsgw/c57055b3fddb58bdc58dddaba5c087e4/raw/15da4f3b5e5b54761f33ec5c45b24e2950040677/meishi2.json',
    })

    const handleJSONClick = () => {
      context.emit('json-button-click', state.jsonURL)
    }

    const handleUSBClick = () => {
      context.emit('usb-button-click')
    }

    return { ...toRefs(state), handleJSONClick, handleUSBClick }
  },
})
</script>
