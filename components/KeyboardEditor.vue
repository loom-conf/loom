<template>
  <div class="editor">
    <template>
      <div class="top">
        <h1>{{ getKeyboardName }}</h1>
        <div v-if="hasConfig" class="keymapViewer">
          <LayerSelector />
          <KeymapViewer />
        </div>
        <div v-else class="initial">
          <InitialPane />
        </div>
      </div>
      <div class="bottom">
        <EditorBottom />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .top {
    background-color: white;
    margin-left: $bottomTabWidth;
    margin-bottom: 2rem;
    padding-top: 1rem;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 2rem;
    border-radius: 0 0 30px 30px;
    .keymapViewer {
      display: flex;
      padding-right: 2rem;
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
  computed,
  watch,
} from '@nuxtjs/composition-api'
import { provideKeyboard, useKeyboard } from '@/stores/useKeyboard'
import { provideKeymap, useKeymap } from '@/stores/useKeymap'
import { provideApp } from '@/stores/useApp'
import KeymapViewer from '@/components/KeymapViewer.vue'
import LayerSelector from '@/components/LayerSelector.vue'
import EditorBottom from '@/components/EditorBottom.vue'
import InitialPane from '@/components/InitialPane.vue'

export default defineComponent({
  components: {
    KeymapViewer,
    LayerSelector,
    EditorBottom,
    InitialPane,
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
    provideApp()

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
