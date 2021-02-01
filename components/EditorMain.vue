<template>
  <div v-if="hasConfig">
    <h1>{{ getKeyboardName }}</h1>
    <KeymapViewer />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import KeymapViewer from '@/components/KeymapViewer.vue'
import { useKeyboard } from '@/stores/useKeyboard'

export default defineComponent({
  components: { KeymapViewer },
  setup() {
    const { config, layout, hasConfig } = useKeyboard()

    const getKeyboardName = computed(() => config.keyboard?.name)
    return { layout, getKeyboardName, hasConfig }
  },
})
</script>
