<template>
  <div class="editor">
    <EditorTop />
    <EditorBottom />
  </div>
</template>

<style lang="scss" scoped>
.editor {
  margin-left: 30px;
}
</style>

<script lang="ts">
import axios from 'axios'
import {
  defineComponent,
  watch,
  useFetch,
  watchEffect,
} from '@nuxtjs/composition-api'
import { provideKeyboard, useKeyboard } from '@/stores/useKeyboard'
import { provideEditor, useEditor } from '@/stores/useEditor'
import EditorTop from '@/components/EditorTop.vue'
import EditorBottom from '@/components/EditorBottom.vue'

export default defineComponent({
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
  components: {
    EditorTop,
    EditorBottom,
  },

  setup(props) {
    provideKeyboard()
    provideEditor()
    const { setting, loadKeyboardConfig } = useKeyboard()
    const { setDeviceSetting } = useEditor()

    // connect keyboard stores and editor store
    watch(
      () => setting.device,
      () => {
        setDeviceSetting(setting.device)
      }
    )

    const { fetchState } = useFetch(async () => {
      const url = new URL(props.defaultJsonUrl)
      const res = await axios.get(url.toString())
      loadKeyboardConfig(res.data, props.defaultJsonUrl)
    })

    watchEffect(() => {
      if (fetchState.error) console.error(fetchState.error)
    })
  },
})
</script>
