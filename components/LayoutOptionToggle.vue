<template>
  <div class="layoutOptionContainer">
    <div class="title">{{ label }}</div>
    <AtomCheckbox :value="!!value" @toggle="toggle" />
  </div>
</template>

<style lang="scss" scoped>
.layoutOptionContainer {
  display: flex;
  .title {
    width: 300px;
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(_props, _context) {
    const toggle = () => {
      _context.emit('toggle', _props.index, _props.value === 1 ? 0 : 1)
    }
    return { toggle }
  },
})
</script>
