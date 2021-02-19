<template>
  <div class="keyTop layerKeyTop withKeycode">
    <div class="labelRow">
      <div class="label">LM</div>
      <div class="value">{{ keycode.layer }}</div>
    </div>
    <div class="legend">
      <div>
        <div class="mods">
          <div v-for="mod in modSymbols" :key="mod">{{ mod }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { LayerModKeycode } from '@/utils/keycodeTypes'

export default defineComponent({
  props: {
    keycode: {
      type: Object as PropType<LayerModKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    const modSymbols = computed(() => {
      if (_props.keycode.mods.length === 1)
        return [_props.keycode.mods[0].substr(1, 3)]
      return _props.keycode.mods.map((mod) => mod.substr(1, 1))
    })
    return { modSymbols }
  },
})
</script>
