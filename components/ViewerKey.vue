<template>
  <div class="layoutKeyWrapper" :style="boxPosStyle">
    {{ layoutKey.labels[0] }}
  </div>
</template>

<style lang="scss" scoped>
.layoutKeyWrapper {
  z-index: 10;
  position: absolute;
  overflow: hidden;
  width: 54px;
  height: 54px;
  border: 1px solid grey;
  margin: 2px;
}
</style>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

import { LayoutKey } from '@/models/keyboardLayout'

export default defineComponent({
  props: {
    layoutKey: {
      type: Object as PropType<LayoutKey>,
      required: true,
    },
  },
  setup(props, _context) {
    const boxPosStyle = computed(() => {
      return {
        top: props.layoutKey.y * 60 + 'px',
        left: props.layoutKey.x * 60 + 'px',
      }
    })
    return { boxPosStyle }
  },
})
</script>
