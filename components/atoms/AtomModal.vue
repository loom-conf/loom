<template>
  <transition name="modalTransition">
    <div v-if="isOpen" class="modalContainer" @click.self="click">
      <slot></slot>
    </div>
  </transition>
</template>

<style lang="scss">
.modalContainer {
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100%;
}
.modalTransition-enter-active,
.modalTransition-leave-active,
.modalContainer > .dialog {
  transition: all 0.2s ease-in-out;
}
.modalTransition-enter,
.modalTransition-leave-to {
  opacity: 0;
  .dialog {
    transform: scale(0);
  }
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
      _context.emit('clickOutside')
    }
    return { click }
  },
})
</script>
