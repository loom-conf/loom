<template>
  <div class="unknownKey keyTop">
    <div class="title">Macro</div>
    <div class="legend">
      <div>
        <div>{{ keycode.raw }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  background-color: $successColor;
}
.legend {
  font-size: small;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { UnknownKeycode } from '@/utils/keycodeTypes'

export default defineComponent({
  props: {
    keycode: {
      type: Object as PropType<UnknownKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    return {}
  },
})
</script>
