<template>
  <div class="keymapViewerContainer" :style="keymapViewerContainerStyle">
    <div class="keymapViewer" :style="keymapViewerStyle">
      <KeymapViewerKey
        v-for="keyLayout in layout"
        :key="`${keyLayout.labels.join()},${keyLayout.x},${keyLayout.y}`"
        :key-layout="keyLayout"
        :keycode-index="getKeycodeIndex(keyLayout.matrix).value"
        :keycode="getKeycode(keyLayout.matrix).value"
        @update-keycode="setKeycode"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keymapViewerContainer {
  overflow: hidden;
  border: solid $bgColor;
  background-color: black;
  border-radius: 8px;
  flex-shrink: 0;
  .keymapViewer {
    position: relative;
    z-index: 100;
  }
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import { useKeymap } from '@/stores/useKeymap'
import { useAppSetting } from '@/stores/useAppSetting'
import { useConsts } from '@/stores/useConsts'
import { RectPoint } from '@/utils/rotateKey'
import KeymapViewerKey from '@/components/KeymapViewerKey.vue'

export default defineComponent({
  components: { KeymapViewerKey },
  setup(_props, _context) {
    const { keyboadConfig } = useKeyboard()
    const { keymap, layout, currentLayer, keyCount, setKeycode } = useKeymap()
    const { viewerOption } = useAppSetting()
    const { KeyConsts } = useConsts()

    const outer = computed(() =>
      layout.value.reduce(
        (ret, item) => {
          if (
            (viewerOption.value.hideUnselectedLayout && item.disabled) ||
            item.decal
          )
            return ret

          const { xValues, yValues } = Object.keys(item.rotated).reduce(
            (ret, key) => {
              ret.xValues.push(item.rotated[key as keyof RectPoint].x)
              ret.yValues.push(item.rotated[key as keyof RectPoint].y)
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

    const keymapViewerContainerStyle = computed(() => ({
      width: `${
        outer.value.right -
        outer.value.left +
        KeyConsts.outerBorder * 2 +
        KeyConsts.outerMargin * 2
      }px !important`,
      height: `${
        outer.value.bottom -
        outer.value.top +
        KeyConsts.outerBorder * 2 +
        KeyConsts.outerMargin * 2
      }px !important`,
      'border-width': `${KeyConsts.outerBorder}px`,
    }))

    const keymapViewerStyle = computed(() => ({
      'margin-top': `${-outer.value.top}px`,
      'margin-left': `${-outer.value.left}px`,
    }))

    const getKeycodeIndex = (matrix: { row: number; col: number }) => {
      return computed(() =>
        keyboadConfig.value && matrix
          ? matrix.row * keyboadConfig.value.matrix.cols +
            matrix.col +
            keyCount.value * currentLayer.value
          : undefined
      )
    }

    const getKeycode = (matrix: { row: number; col: number }) =>
      computed(() => {
        const index = getKeycodeIndex(matrix)
        return index.value === undefined ? undefined : keymap.value[index.value]
      })

    return {
      layout,
      keymapViewerContainerStyle,
      keymapViewerStyle,
      getKeycodeIndex,
      getKeycode,
      setKeycode,
    }
  },
})
</script>
