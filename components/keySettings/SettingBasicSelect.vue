<template>
  <div><VueSelect :options="getKeycodeList()" label="qmk" /></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import VueSelect from 'vue-select'
import { getKeycodeList } from '~/utils/keycodes'
import { BaseKeycode } from '~/utils/keycodeTypes'

export default defineComponent({
  components: { VueSelect },
  props: {
    baseKeycode: {
      type: Object as PropType<BaseKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    return { getKeycodeList }
  },
})
</script>
