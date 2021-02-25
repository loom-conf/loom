<template>
  <div v-if="isOpen" class="modalContainer" @click.self="click">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.modalContainer {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(_props, _context) {
    const click = () => {
      _context.emit('close')
    }
    return { click }
  },
})
</script>
