<template>
  <div class="layoutOption">
    <div class="label">{{ label }}</div>
    <AtomSelect :options="options" :value="value" @change="change" />
  </div>
</template>

<style lang="scss" scoped>
.layoutOption {
  display: flex;
  margin: 0.3rem 0;
  .label {
    width: 200px;
  }
}
</style>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import AtomSelect from '@/components/AtomSelect.vue'

export default defineComponent({
  components: { AtomSelect },
  props: {
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array as PropType<string[]>,
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
    const change = (value: number) => {
      _context.emit('change', value, _props.index)
    }
    return { change }
  },
})
</script>
