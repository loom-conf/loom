<template>
  <div v-if="layerCount" class="layerCount">
    <div class="layer">LAYER</div>
    <div
      v-for="n of layerCount"
      :key="n"
      :class="getLayerItemStyle(n).value"
      @click="layerItemClicked(n)"
    >
      {{ n }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layerCount {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
  .layerItem {
    width: 25px;
    height: 25px;
    margin: 5px;
    text-align: center;
    font-weight: bold;
    border-radius: 20%;
    border: grey solid 2px;
    cursor: pointer;
    &.selected {
      border: cornflowerblue solid 2px;
      background-color: cornflowerblue;
    }
  }
}
</style>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

import { useKeyboard } from '@/stores/useKeyboard'
import { useKeymap } from '@/stores/useKeymap'

export default defineComponent({
  setup(_props, _context) {
    const { deviceConfig } = useKeyboard()
    const { currentLayer } = useKeymap()

    const layerCount = computed(() => deviceConfig.value?.layerCount ?? 4)

    const getLayerItemStyle = (n: number) =>
      computed(() =>
        n === currentLayer.value + 1 ? ['layerItem', 'selected'] : ['layerItem']
      )

    const layerItemClicked = (n: number) => {
      currentLayer.value = n - 1
    }

    return { layerCount, currentLayer, getLayerItemStyle, layerItemClicked }
  },
})
</script>
