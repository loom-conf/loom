<template>
  <div class="keymapViewer" :style="keymapViewerStyle">
    <div class="keymapWrapper">
      <ViewerKey
        v-for="layoutKey in layout"
        :key="layoutKey.labels[0]"
        :layout-key="layoutKey"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keymapViewer {
  border: 1px solid grey;
  padding: 10px;
}
.keymapWrapper {
  position: relative;
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import ViewerKey from '@/components/ViewerKey.vue'

export default defineComponent({
  components: { ViewerKey },
  setup(props, _context) {
    const { layout } = useKeyboard()
    const keymapViewerStyle = computed(() => {
      const col = layout.value.reduce(
        (ret, v) => Math.max(ret, v.matrix.col),
        0
      )
      const row = layout.value.reduce(
        (ret, v) => Math.max(ret, v.matrix.row),
        0
      )
      return {
        width: (col + 1) * 60 + 20 + 'px',
        height: (row + 1) * 60 + 20 + 'px',
      }
    })
    return { layout, keymapViewerStyle }
  },
})
</script>
