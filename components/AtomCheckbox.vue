<template>
  <div :class="checkboxClass" @click="clicked">
    <span><AtomIcon v-if="value" :icon="mdiCheck" /></span>
  </div>
</template>

<style lang="scss" scoped>
.checkbox {
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  border: 1px solid grey;
}
</style>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

import { mdiCheck } from '@mdi/js'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props, _context) {
    const checkboxClass = computed(() => ['checkbox'])
    const clicked = () => {
      _context.emit('toggle', !_props.value)
    }
    return { checkboxClass, clicked, mdiCheck }
  },
})
</script>
