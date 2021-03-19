<template>
  <AtomInput :value="inputValue" @submit="change" @blur="change" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import AtomInput from '@/components/atoms/AtomInput.vue'

export default defineComponent({
  components: { AtomInput },
  props: {
    raw: { type: Number, required: true },
  },
  setup(_props, _context) {
    const inputValue = computed(() => _props.raw?.toString())
    const change = (input: string) => {
      const newRaw = parseInt(input)
      if (isNaN(newRaw)) return
      _context.emit('changeRaw', newRaw)
    }
    return { inputValue, change }
  },
})
</script>
