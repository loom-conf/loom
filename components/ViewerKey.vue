<template>
  <div class="keyOuter" :style="style" @click="click">
    {{ getLabel }}
  </div>
</template>

<style lang="scss" scoped>
.keyOuter {
  z-index: 10;
  position: absolute;
  overflow: hidden;
  border: 1px solid grey;
}
</style>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

import { KeyLayout } from '@/models/keyboardLayout'
import { KeycodeTypes } from '@/utils/keycode'
import { useConsts } from '@/stores/useConsts'

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
    const { KeyConsts, calcKeySize } = useConsts()

    const style = computed(() => ({
      top: calcKeySize(props.keyLayout.y) + KeyConsts.margin + 'px',
      left: calcKeySize(props.keyLayout.x) + KeyConsts.margin + 'px',
      width: calcKeySize(props.keyLayout.width) + 'px',
      height: calcKeySize(props.keyLayout.height) + 'px',
      border: KeyConsts.border + 'px' + ' solid',
    }))

    const getLabel = computed(() => {
      if (props.keycode === undefined) return props.keyLayout.labels[0]
      return 'qmk' in props.keycode ? props.keycode.qmk : props.keycode.raw
    })

    const click = () => {
      console.log(props.keyLayout.labels)
    }

    return { style, getLabel, click }
  },
})
</script>
