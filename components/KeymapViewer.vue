<template>
  <div class="keymapViewer" :style="keymapViewerStyle">
    <div class="keymapContainer">
      <ViewerKey
        v-for="keyLayout in layout"
        :key="keyLayout.labels[0]"
        :key-layout="keyLayout"
        :keycode="getKeycode(keyLayout.matrix).value"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keymapViewer {
  border: 1px solid grey;
  padding: 5px;
}
.keymapContainer {
  position: relative;
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import { useEditor } from '@/stores/useEditor'

import ViewerKey from '@/components/ViewerKey.vue'

export default defineComponent({
  components: { ViewerKey },
  setup(_props, _context) {
    const { layout, config } = useKeyboard()
    const { keymap } = useEditor()

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
        width: (col + 1) * 60 + 10 + 'px',
        height: (row + 1) * 60 + 10 + 'px',
      }
    })

    const getKeycode = ({ row, col }: { row: number; col: number }) => {
      return computed(() => {
        if (config.keyboard)
          return keymap.value[row * config.keyboard.matrix.cols + col]
        else return undefined
      })
    }

    return { layout, keymapViewerStyle, getKeycode }
  },
})
</script>
