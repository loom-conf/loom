<template>
  <div class="toggle containt">
    <div class="label">{{ label }}</div>
    <AtomCheckbox :value="!!value" @toggle="toggle" />
  </div>
</template>

<style lang="scss" scoped>
.toggle {
  display: flex;
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import AtomCheckbox from '@/components/atoms/AtomCheckbox.vue'

export default defineComponent({
  components: { AtomCheckbox },
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
    index: {
      type: Number,
      required: false,
    },
  },
  setup(_props, _context) {
    const toggle = () => {
      _context.emit('toggle', !_props.value, _props.index)
    }
    return { toggle }
  },
})
</script>
