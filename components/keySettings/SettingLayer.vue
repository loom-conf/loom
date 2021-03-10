<template>
  <VueSelect
    :clearable="false"
    :append-to-body="true"
    :options="layerItems"
    :value="layer"
    label="layer"
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
import { computed, defineComponent } from '@nuxtjs/composition-api'
import VueSelect from 'vue-select'
import { useKeyboard } from '@/stores/useKeyboard'
import { getKeycodeList } from '@/utils/keycodes'

export default defineComponent({
  components: { VueSelect },
  props: {
    layer: {
      type: Number,
      required: true,
    },
  },
  setup(_props, _context) {
    const { deviceConfig } = useKeyboard()
    const layerItems = computed(() =>
      [...Array(deviceConfig.value?.layerCount)].map((_, i) => i)
    )
    const input = (newLayer: String) => {
      _context.emit('changeLayer', Number(newLayer))
    }
    return { layerItems, getKeycodeList, input }
  },
})
</script>
