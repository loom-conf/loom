<template>
  <AtomInput
    :value="raw !== undefined ? raw.toString() : undefined"
    @submit="change"
    @blur="change"
  />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import AtomInput from '@/components/atoms/AtomInput.vue'
import AtomButton from '../atoms/AtomButton.vue'

export default defineComponent({
  components: { AtomInput, AtomButton },
  props: {
    raw: { type: Number, required: true },
  },
  setup(_props, _context) {
    const change = (input: string) => {
      const newRaw = parseInt(input)
      if (isNaN(newRaw)) return
      _context.emit('changeRaw', newRaw)
    }
    return { change }
  },
})
</script>
