<template>
  <div class="editor">
    <div class="topContainer">
      <div v-if="hasConfig">
        <h1>{{ getKeyboardName }}</h1>
        <div class="keymapViewerContainer">
          <LayerSelector />
          <KeymapViewer />
        </div>
      </div>
    </div>
    <EditorBottom />
  </div>
</template>

<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  .topContainer {
    min-height: 40vh;
    .keymapViewerContainer {
      display: flex;
    }
  }
  .bottomContainer {
    flex: 1;
  }
}
</style>

<script lang="ts">
import axios from 'axios'
import {
  defineComponent,
  useFetch,
  watchEffect,
  computed,
  watch,
} from '@nuxtjs/composition-api'
import { provideKeyboard, useKeyboard } from '@/stores/useKeyboard'
import { provideKeymap, useKeymap } from '@/stores/useKeymap'
import { provideEditor } from '@/stores/useEditor'

import KeymapViewer from '@/components/KeymapViewer.vue'
import LayerSelector from '@/components/LayerSelector.vue'
import EditorBottom from '@/components/EditorBottom.vue'

export default defineComponent({
  components: {
    KeymapViewer,
    LayerSelector,
    EditorBottom,
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
    provideKeyboard()
    provideKeymap()
    provideEditor()

    const {
      loadKeyboardConfig,
      keyboadConfig,
      deviceSetting,
      hasConfig,
    } = useKeyboard()
    const { setKeyboardConfig, setDeviceSetting } = useKeymap()

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

    const getKeyboardName = computed(() => keyboadConfig.value?.name)

    return { getKeyboardName, hasConfig }
  },
})
</script>
