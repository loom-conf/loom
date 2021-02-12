<template>
  <button :class="buttonClass" @click="buttonClicked">
    <slot>BUTTON</slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  text-transform: uppercase;
  outline: 0;
  background: cornflowerblue;
  border: 1px solid cornflowerblue;
  padding: 0.5em 2em;
  color: #fff;
  font-size: 12px;
  border-radius: 1px;
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    background: darken(cornflowerblue, 15%);
    border-color: darken(cornflowerblue, 15%);
  }

  &.disabled {
    background: silver;
    color: lighten(silver, 20%);
    border-color: lighten(silver, 20%);
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
