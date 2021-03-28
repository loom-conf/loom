<template>
  <div :class="{ dragging: isDragging }" class="keymapPickerKey">
    <div
      class="draggable"
      draggable="true"
      @dragstart="startDrag"
      @dragend="endDrag"
    >
      <component
        :is="getKeyComponent(keycode.kind)"
        v-tooltip.bottom="keycode.qmk"
        :keycode="keycode"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keymapPickerKey {
  margin: 1px;
  width: 54px;
  height: 54px;
  overflow: hidden;
  border: 1px solid black;
  &.dragging {
    border: 3px solid $subColor;
  }
  .draggable {
    width: 100%;
    height: 100%;
  }
}
</style>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { getKeyComponent } from '@/models/keytop'
import { KeycodeTypes } from '@/utils/keycodeTypes'

export default defineComponent({
  components: {},
  props: {
    keycode: {
      type: Object as PropType<KeycodeTypes>,
      required: true,
    },
  },
  setup(_props, _context) {
    const isDragging = ref(false)
    const startDrag = (event: DragEvent) => {
      isDragging.value = true
      if (event.dataTransfer)
        event.dataTransfer.setData('keycode', JSON.stringify(_props.keycode))
    }
    const endDrag = (event: DragEvent) => {
      isDragging.value = false
      if (event.dataTransfer) event.dataTransfer.setData('keycode', '')
    }
    return { getKeyComponent, isDragging, startDrag, endDrag }
  },
})
</script>
