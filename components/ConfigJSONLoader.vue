<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from '@nuxtjs/composition-api'

interface State {
},

export default defineComponent({
  props: {
  },
  setup(_props, _context) {
    const state = reactive<State>({

    })
    return { state, }
  },
})
</script>
