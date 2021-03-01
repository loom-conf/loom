<template>
  <div class="keyTop SpecialKeytop">
    <div class="labelRow">
      <div class="label">{{ keycode.base.type }}</div>
    </div>
    <div class="legend">
      <div>
        <div>{{ keycode.qmk }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { SpecialKeycode } from '@/utils/keycodeTypes'

export default defineComponent({
  props: {
    keycode: {
      type: Object as PropType<SpecialKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    return {}
  },
})
</script>
