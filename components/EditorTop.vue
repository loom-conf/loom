<template>
  <div class="editorTopContainer">
    <div v-if="hasConfig" id="editorTop">
      <h1>{{ getKeyboardName }}</h1>
      <KeymapViewer />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editorTopContainer {
  min-height: 40vh;
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import KeymapViewer from '@/components/KeymapViewer.vue'
import { useKeyboard } from '@/stores/useKeyboard'

export default defineComponent({
  components: { KeymapViewer },
  setup() {
    const { config, hasConfig } = useKeyboard()

    const getKeyboardName = computed(() => config.keyboard?.name)
    return { getKeyboardName, hasConfig }
  },
})
</script>
