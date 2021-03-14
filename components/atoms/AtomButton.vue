<template>
  <button :class="buttonClass" @click="buttonClicked">
    <slot>BUTTON</slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  height: 32px;
  text-transform: uppercase;
  outline: 0;
  background: $successColor;
  border: none;
  padding: 0 1rem;
  color: $mainBgColor;
  font-size: medium;
  font-weight: 600;
  border-radius: 1px;
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    background: darken($successColor, 15%);
    border-color: darken($successColor, 15%);
  }

  &.disabled {
    background: $disableColor;
    color: lighten($disableColor, 20%);
    border-color: lighten($disableColor, 20%);
    cursor: not-allowed;
  }
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props, _context) {
    const buttonClass = computed(() => (_props.disabled ? 'disabled' : ''))
    const buttonClicked = () => {
      _context.emit('click')
    }
    return { buttonClass, buttonClicked }
  },
})
</script>
