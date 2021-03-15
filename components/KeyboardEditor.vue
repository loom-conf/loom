<template>
  <div class="editor">
    <div class="top">
      <div v-if="hasLayout" class="keymapEditor">
        <KeymapEditor />
      </div>
      <div v-else class="initialPane">
        <InitialPane />
      </div>
    </div>
    <div class="bottom">
      <KeyboardEditorBottom />
    </div>
    <KeySettingPopup />
  </div>
</template>

<style lang="scss" scoped>
.editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .top {
    display: flex;
    min-width: 600px;
    margin-left: $bottomTabWidth;
    margin-bottom: 2rem;
    .keymapEditor,
    .initialPane {
      padding: 0 24px 24px 16px;
      background-color: white;
      border: 10px solid black;
      border-radius: 10px;
    }
  }
  .bottom {
    flex: 1;
    width: 100vw;
    height: 100%;
  }
}
</style>

<script lang="ts">
import axios from 'axios'
import {
  defineComponent,
  useFetch,
  watchEffect,
  watch,
  computed,
} from '@nuxtjs/composition-api'
import { provideKeyboard, useKeyboard } from '@/stores/useKeyboard'
import { provideKeymap, useKeymap } from '@/stores/useKeymap'
import { provideAppSetting } from '@/stores/useAppSetting'
import { provideKeySettingPopup } from '@/stores/useKeySettingPopup'
import KeyboardEditorBottom from '@/components/KeyboardEditorBottom.vue'
import InitialPane from '@/components/InitialPane.vue'
import KeymapEditor from '@/components/KeymapEditor.vue'
import KeySettingPopup from '@/components/KeySettingPopup.vue'

export default defineComponent({
  components: {
    KeyboardEditorBottom,
    InitialPane,
    KeymapEditor,
    KeySettingPopup,
  },
  props: {
    defaultJsonUrl: {
      type: String,
      required: true,
    },
    defaultKeyboardName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    provideAppSetting()
    provideKeyboard()
    provideKeymap()
    provideKeySettingPopup()

    const { loadKeyboardConfig, keyboadConfig, deviceSetting } = useKeyboard()

    const { setKeyboardConfig, setDeviceSetting, layout } = useKeymap()

    // connect stores
    watch(keyboadConfig, (v) => {
      setKeyboardConfig(v)
    })

    watch(deviceSetting, (v) => {
      setDeviceSetting(v)
    })

    const { fetchState } = useFetch(async () => {
      if (props.defaultJsonUrl) {
        const url = new URL(props.defaultJsonUrl)
        const res = await axios.get(url.toString())
        loadKeyboardConfig(res.data, props.defaultJsonUrl)
      }
    })
    watchEffect(() => {
      if (fetchState.error) console.error(fetchState.error)
    })

    const hasLayout = computed(() => !!layout.value.length)

    return { hasLayout }
  },
})
</script>
