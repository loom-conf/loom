<template>
  <div class="tabButton" :class="{ selected: isSelected }" @click="click">
    {{ name }}
  </div>
</template>

<style lang="scss">
.tabButton {
  width: $bottomTabWidth;
  position: relative;
  align-items: center;
  text-align: right;
  height: 2rem;
  margin: 1rem 0;
  padding: 0 0.5rem 0 0;
  font-weight: bolder;
  text-transform: uppercase;
  letter-spacing: 0.3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  color: $subColor;
  cursor: pointer;
  &::after {
    position: absolute;
    bottom: 0;
    right: 0;
    content: '';
    width: 80%;
    height: 2px;
    background: $subColor;
    transform: scale(0, 1);
    transform-origin: right top;
    transition: transform 0.3s;
  }
  &:hover::after {
    visibility: visible;
    transform: scale(1, 1);
  }
  &.selected::after {
    visibility: visible;
    background: $fontColor;
    transform: scale(1, 1);
    transition: all 0.5s;
  }
  &.selected {
    visibility: visible;
    color: $fontColor;
    transition: all 0.5s;
  }
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    },
  },
  setup(_props, _context) {
    const click = () => {
      _context.emit('click', _props.name)
    }

    const isSelected = computed(() => _props.name === _props.selected)
    return { click, isSelected }
  },
})
</script>
