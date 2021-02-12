<template>
  <svg viewBox="0 0 24 24"><path :d="icon" /></svg>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  setup(_props, _context) {
    return {}
  },
})
</script>
