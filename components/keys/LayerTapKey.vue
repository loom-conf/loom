<template>
  <div class="keyTop layerKeyTop withKeycode">
    <div class="labelRow">
      <div class="label">LT</div>
      <div class="value">{{ keycode.layer }}</div>
    </div>
    <div class="legend">
      <div>
        <div class="keycode">{{ keycode.tap.legend }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { LayerTapKeycode } from '@/utils/keycodeTypes'

export default defineComponent({
  props: {
    keycode: {
      type: Object as PropType<LayerTapKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    return {}
  },
})
</script>
