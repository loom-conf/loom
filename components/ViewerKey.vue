<template>
  <div class="keyLayoutWrapper" :style="boxPosStyle">
    {{ getLabel }}
  </div>
</template>

<style lang="scss" scoped>
.keyLayoutWrapper {
  z-index: 10;
  position: absolute;
  overflow: hidden;
  width: 50px;
  height: 50px;
  border: 1px solid grey;
  margin: 4px;
}
</style>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

import { KeyLayout } from '@/models/keyboardLayout'
import { KeycodeTypes } from '~/utils/keycode'

export default defineComponent({
  props: {
    keyLayout: {
      type: Object as PropType<KeyLayout>,
      required: true,
    },
    keycode: {
      type: Object as PropType<KeycodeTypes> | undefined,
      default: undefined,
    },
  },

  setup(props, _context) {
    const boxPosStyle = computed(() => ({
      top: props.keyLayout.y * 55 + 'px',
      left: props.keyLayout.x * 55 + 'px',
    }))

    const getLabel = computed(() => {
      if (props.keycode === undefined) return props.keyLayout.labels[0]
      return 'qmk' in props.keycode ? props.keycode.qmk : props.keycode.raw
    })

    return { boxPosStyle, getLabel }
  },
})
</script>
