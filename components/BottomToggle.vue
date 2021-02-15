<template>
  <div class="toggle" @click="toggle">
    <div class="label">{{ label }}</div>
    <AtomCheckbox :value="!!value" />
  </div>
</template>

<style lang="scss" scoped>
.toggle {
  display: flex;
  margin: 0.3rem 0;
  cursor: pointer;
  .label {
    width: 200px;
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import AtomCheckbox from '@/components/AtomCheckbox.vue'

export default defineComponent({
  components: { AtomCheckbox },
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
      required: false,
    },
  },
  setup(_props, _context) {
    const toggle = () => {
      _context.emit('toggle', _props.value === 1 ? 0 : 1, _props.index)
    }
    return { toggle }
  },
})
</script>
