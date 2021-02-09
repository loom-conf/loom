<template>
  <div class="keymapContainer" :style="keymapContainerStyle">
    <div class="keymapViewer" :style="keymapViewerStyle">
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
  border-radius: 8px;
  .keymapViewer {
    position: relative;
  }
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import { useKeymap } from '@/stores/useKeymap'
import { useConsts } from '@/stores/useConsts'
import { rotateRect, RectPoint } from '@/utils/rotateKey'

import ViewerKey from '@/components/ViewerKey.vue'

export default defineComponent({
  components: { ViewerKey },
  setup(_props, _context) {
    const { keyboadConfig } = useKeyboard()
    const { keymap, layout, currentLayer, keyCount } = useKeymap()
    const { KeyConsts, calcKeySize } = useConsts()

    const outer = computed(() =>
      layout.value.reduce(
        (ret, item) => {
          const rotated = rotateRect(
            { x: item.x, y: item.y },
            { width: item.width, height: item.height },
            {
              rx: item.rotation_x,
              ry: item.rotation_y,
              r: item.rotation_angle,
            }
          )

          const { xValues, yValues } = Object.keys(rotated).reduce(
            (ret, key) => {
              ret.xValues.push(rotated[key as keyof RectPoint].x)
              ret.yValues.push(rotated[key as keyof RectPoint].y)
              return ret
            },
            { xValues: [] as number[], yValues: [] as number[] }
          )
          return {
            top: Math.min(ret.top, ...yValues),
            bottom: Math.max(ret.bottom, ...yValues),
            left: Math.min(ret.left, ...xValues),
            right: Math.max(ret.right, ...xValues),
          }
        },
        {
          top: 10000,
          bottom: -10000,
          left: 10000,
          right: -10000,
        }
      )
    )

    const keymapContainerStyle = computed(() => ({
      width: `${
        calcKeySize(outer.value.right - outer.value.left) +
        (KeyConsts.margin + KeyConsts.border) * 2
      }px`,
      height: `${
        calcKeySize(outer.value.bottom - outer.value.top) +
        (KeyConsts.margin + KeyConsts.border) * 2
      }px`,
    }))

    const keymapViewerStyle = computed(() => ({
      'margin-top': `${calcKeySize(-outer.value.top)}px`,
      'margin-left': `${calcKeySize(-outer.value.left)}px`,
    }))

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

    return { layout, keymapContainerStyle, keymapViewerStyle, getKeycode }
  },
})
</script>
