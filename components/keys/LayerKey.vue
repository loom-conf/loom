<template>
  <div class="keyTop layerKeyTop">
    <div class="labelRow">
      <div class="label">{{ label }}</div>
    </div>
    <div class="legend">
      <div>
        <div class="value">{{ keycode.layer }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { LayerKeycodeTypes } from '@/utils/keycodeTypes'

export default defineComponent({
  props: {
    keycode: {
      type: Object as PropType<LayerKeycodeTypes>,
      required: true,
    },
  },
  setup(_props, _context) {
    const label = computed(() =>
      _props.keycode.qmk.slice(0, _props.keycode.qmk.indexOf('('))
    )
    return { label }
  },
})
</script>
