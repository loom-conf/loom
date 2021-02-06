<template>
  <div>
    <v-switch :label="label" :input-value="value" @change="toggleChanged">
    </v-switch>
  </div>
</template>

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
    const toggleChanged = () => {
      _context.emit('toggle', _props.index, _props.value === 1 ? 0 : 1)
    }
    return { toggleChanged }
  },
})
</script>
