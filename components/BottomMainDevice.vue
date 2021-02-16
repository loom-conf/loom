<template>
  <div>
    <div class="block">
      <div class="header">Load keyboard config</div>
      <div class="item">
        <AtomInput
          v-model="jsonURL"
          label="JSON URL"
          class="textField"
        ></AtomInput>
        <AtomButton :disabled="isLoading" @click="jsonButtonClicked"
          >load</AtomButton
        >
      </div>
      <div v-if="hasConfig" class="info">Loaded - {{ configName }}</div>
    </div>
    <div class="block">
      <div class="header">Connect USB device</div>
      <AtomButton
        :disabled="!hasConfig || isConnected"
        @click="connectButtonClicked"
        >connect</AtomButton
      >
      <h3 v-if="isConnected">Connected - {{ deviceName }}</h3>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.textField {
  width: 500px;
}
</style>

<script lang="ts">
import axios from 'axios'
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import AtomInput from '@/components/atoms/AtomInput.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'

interface State {
  jsonURL: string
  isLoading: boolean
}

export default defineComponent({
  components: { AtomInput, AtomButton },
  setup(_props, _context) {
    const state = reactive<State>({
      jsonURL:
        'https://gist.githubusercontent.com/hsgw/b9df17b75f12d53e025416af3bd227d8/raw/c8db14f146f685fa81f93d54ee4e7f5e041a191a/tartan.json',
      isLoading: false,
    })

    const {
      connectDevice,
      loadKeyboardConfig,
      hasConfig,
      isConnected,
      keyboadConfig,
      deviceConfig,
    } = useKeyboard()

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
      } catch (e) {
        console.error(e)
      }
    }

    const configName = computed(() => keyboadConfig.value?.name)
    const deviceName = computed(() => deviceConfig.value?.name)

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