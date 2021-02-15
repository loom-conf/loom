<template>
  <div>
    <div>
      <h2>1.Load keyboard config</h2>
      <AtomInput
        v-model="jsonURL"
        label="JSON URL"
        class="textField"
      ></AtomInput>
      <AtomButton :disabled="isLoading" @click="jsonButtonClicked"
        >load</AtomButton
      >
      <h3 v-if="hasConfig">Loaded - {{ configName }}</h3>
    </div>
    <div>
      <h2>2.Connect USB device</h2>
      <AtomButton
        :disabled="!hasConfig || isConnected"
        @click="connectButtonClicked"
        >connect</AtomButton
      >
      <h3 v-if="isConnected">Connected - {{ deviceName }}</h3>
    </div>
    <div v-if="hasConfig">
      <h2>Layout Option</h2>
      <LayoutOption />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.textField {
  width: 400px;
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
import AtomInput from '@/components/AtomInput.vue'
import AtomButton from '@/components/AtomButton.vue'
import LayoutOption from '@/components/LayoutOption.vue'

interface State {
  jsonURL: string
  isLoading: boolean
}

export default defineComponent({
  components: { AtomInput, AtomButton, LayoutOption },
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
