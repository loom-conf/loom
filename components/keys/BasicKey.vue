<template>
  <div class="basicKey keyTop">
    <div v-if="hasMods" class="mods">
      <div v-for="symbol in modSymbols" :key="symbol" class="symbol">
        {{ symbol }}
      </div>
    </div>
    <div class="legend">
      <div>
        <div v-if="isVisibleAltLegend">
          {{ keycode.base.altLegend }}
        </div>
        <div>{{ keycode.base.legend }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mods {
  color: white;
  background-color: $successColor;
}
</style>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { BasicKeycode } from '@/utils/keycodeTypes'

export default defineComponent({
  props: {
    keycode: {
      type: Object as PropType<BasicKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    const hasMods = computed(() => _props.keycode.mods.length !== 0)
    const modSymbols = computed(() =>
      _props.keycode.mods.map((mod) => mod.substr(1, 1))
    )
    const isVisibleAltLegend = computed(
      () => _props.keycode.base.altLegend && !hasMods.value
    )
    return { hasMods, modSymbols, isVisibleAltLegend }
  },
})
</script>
