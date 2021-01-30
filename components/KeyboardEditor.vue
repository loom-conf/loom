<template>
  <div>
    <EditorMain />
    <EditorBottom />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import EditorMain from '@/components/EditorMain.vue'
import EditorBottom from '@/components/EditorBottom.vue'
import { useKeyboard } from '@/stores/useKeyboard'

export default defineComponent({
  components: {
    EditorMain,
    EditorBottom,
  },

  setup() {
    const keyboard = useKeyboard()
    return {}
  },
})
</script>
