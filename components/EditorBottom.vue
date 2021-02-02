<template>
  <div class="editorBottom">
    <KeyboardConfig />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import KeyboardConfig from '@/components/EditorBottom/KeyboardConfig.vue'

interface State {}

export default defineComponent({
  components: { KeyboardConfig },
  setup(_props, _context) {
    return {}
  },
})
</script>
