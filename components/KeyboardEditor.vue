<template>
  <div>
    <EditorTop />
    <EditorBottom />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { provideKeyboard } from '@/stores/useKeyboard'
import { provideEditor } from '@/stores/useEditor'
import EditorTop from '@/components/EditorTop.vue'
import EditorBottom from '@/components/EditorBottom.vue'

export default defineComponent({
  components: {
    EditorTop,
    EditorBottom,
  },

  setup() {
    provideKeyboard()
    provideEditor()
    return {}
  },
})
</script>
