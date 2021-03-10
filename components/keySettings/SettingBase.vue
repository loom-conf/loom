<template>
  <VueSelect
    :clearable="false"
    :append-to-body="true"
    :options="getKeycodeList()"
    :value="baseKeycode.qmk"
    label="qmk"
    @input="input"
  />
</template>

<style lang="scss">
.basicSelect {
  height: 32px;
  font-size: 12px;
  color: $fontColor;
}
</style>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import VueSelect from 'vue-select'
import { getKeycodeList } from '@/utils/keycodes'
import { BaseKeycode } from '@/utils/keycodeTypes'

export default defineComponent({
  components: { VueSelect },
  props: {
    baseKeycode: {
      type: Object as PropType<BaseKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    const input = (newBaseKeycode: BaseKeycode) => {
      _context.emit('changeBaseKeycode', newBaseKeycode)
    }
    return { getKeycodeList, input }
  },
})
</script>
