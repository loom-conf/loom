<template>
  <div class="editor">
    <div class="top">
      <KeymapEditor v-if="hasLayout" />
      <InitialPane v-else />
    </div>
    <div class="bottom">
      <KeyboardEditorBottom />
    </div>
    <KeySettingPopup />
    <Dialog />
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
    width: 100%;
    padding-left: $bottomTabWidth;
    margin-bottom: 2rem;
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
import { provideDialog } from '@/stores/useDialog'
import KeyboardEditorBottom from '@/components/KeyboardEditorBottom.vue'
import InitialPane from '@/components/InitialPane.vue'
import KeymapEditor from '@/components/KeymapEditor.vue'
import KeySettingPopup from '@/components/KeySettingPopup.vue'
import Dialog from '@/components/Dialog.vue'

export default defineComponent({
  components: {
    KeyboardEditorBottom,
    InitialPane,
    KeymapEditor,
    KeySettingPopup,
    Dialog,
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
    provideDialog()
    provideAppSetting()
    provideKeySettingPopup()
    provideKeyboard()
    provideKeymap()

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
