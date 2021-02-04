<template>
  <div class="editor">
    <div class="topContainer">
      <div v-if="hasConfig">
        <h1>{{ getKeyboardName }}</h1>
        <KeymapViewer />
      </div>
    </div>
    <EditorBottom />
  </div>
</template>

<style lang="scss" scoped>
.editor {
  margin-left: 30px;
  .topContainer {
    min-height: 40vh;
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

import KeymapViewer from '@/components/KeymapViewer.vue'
import EditorBottom from '@/components/EditorBottom.vue'

export default defineComponent({
  components: {
    KeymapViewer,
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

    const { loadKeyboardConfig, keyboadConfig, hasConfig } = useKeyboard()
    const { setRawLayout } = useKeymap()

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

    // connect stores
    watch(keyboadConfig, (v) => {
      setRawLayout(v?.layouts.keymap)
    })

    const getKeyboardName = computed(() => keyboadConfig.value?.name)

    return { getKeyboardName, hasConfig }
  },
})
</script>
