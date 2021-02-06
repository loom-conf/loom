<template>
  <div class="keymapViewer">
    <div class="keymapContainer" :style="keymapViewerStyle">
      <ViewerKey
        v-for="keyLayout in layout"
        :key="keyLayout.labels.join()"
        :key-layout="keyLayout"
        :keycode="getKeycode(keyLayout.matrix).value"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keymapContainer {
  border: 1px solid grey;
  position: relative;
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import { useKeymap } from '@/stores/useKeymap'
import { useConsts } from '@/stores/useConsts'

import ViewerKey from '@/components/ViewerKey.vue'

export default defineComponent({
  components: { ViewerKey },
  setup(_props, _context) {
    const { keyboadConfig } = useKeyboard()
    const { keymap, layout, currentLayer, keyCount } = useKeymap()
    const { KeyConsts, calcKeySize } = useConsts()

    const keymapViewerStyle = computed(() => {
      const col = layout.value.reduce((ret, v) => Math.max(ret, v.x), 0)
      const row = layout.value.reduce((ret, v) => Math.max(ret, v.y), 0)
      return {
        width: `${
          (col + 1) * calcKeySize(1) + (KeyConsts.margin + KeyConsts.border) * 2
        }px`,
        height: `${
          (row + 1) * calcKeySize(1) + (KeyConsts.margin + KeyConsts.border) * 2
        }px`,
      }
    })

    const getKeycode = ({ row, col }: { row: number; col: number }) => {
      return computed(() =>
        keyboadConfig.value
          ? keymap.value[
              row * keyboadConfig.value.matrix.cols +
                col +
                keyCount.value * currentLayer.value
            ]
          : undefined
      )
    }

    return { layout, keymapViewerStyle, getKeycode }
  },
})
</script>
