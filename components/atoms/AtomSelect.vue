<template>
  <div class="selectBox">
    <select v-model="selected" options="items" @change="change">
      <option
        v-for="(option, index) in options"
        :key="`${option},${index}`"
        :value="index"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
.selectBox {
  position: relative;
  display: inline-block;
  select {
    appearance: none;
    display: block;
    width: 100%;
    max-width: 400px;
    height: 24px;
    float: right;
    padding: 0 2rem 0 0.5rem;
    color: black;
    background-color: #fff;
    background-image: none;
    border: 1px solid $bgColor;
    -ms-word-break: normal;
    word-break: normal;
  }
  &::after {
    content: '<>';
    font: 15px 'Consolas', monospace;
    color: grey;
    transform: rotate(90deg);
    right: 0.2rem;
    top: 2.5px;
    padding: 0 0 1px;
    position: absolute;
    pointer-events: none;
  }
}
</style>

<script lang="ts">
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    options: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  setup(_props, _context) {
    const selected = ref(_props.value)
    const change = () => {
      _context.emit('change', selected.value)
    }
    return { selected, change }
  },
})
</script>
