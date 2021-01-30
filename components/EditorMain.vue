<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api'

interface State {}

export default defineComponent({
  setup(props, _context) {
    const state = reactive<State>({})
    return { state, props }
  },
})
</script>
