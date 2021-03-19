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
import {
  defineComponent,
  useFetch,
  watch,
  computed,
  wrapProperty,
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

const useGtag = wrapProperty('$gtag', false)

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
    const gtagEvent = useGtag().event
    const {
      fetchKeybordConfig,
      keyboadConfig,
      deviceSetting,
      deviceConfig,
    } = useKeyboard()
    const { setKeyboardConfig, setDeviceSetting, layout } = useKeymap()

    // connect stores
    watch(keyboadConfig, (v) => {
      if (v) {
        gtagEvent('load', {
          event_category: 'config',
          event_label: v.name,
        })
      }
      setKeyboardConfig(v)
    })

    watch(deviceSetting, (v) => {
      if (v && deviceConfig.value) {
        gtagEvent('connect', {
          event_category: 'device',
          event_label: deviceConfig.value.name,
        })
      }
      setDeviceSetting(v)
    })

    useFetch(async () => {
      if (props.defaultJsonUrl) {
        await fetchKeybordConfig(props.defaultJsonUrl)
      }
    })

    const hasLayout = computed(() => !!layout.value.length)

    return { hasLayout }
  },
})
</script>
