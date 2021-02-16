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
  .layer {
    font-size: small;
    border-bottom: 1px solid $fontSubColor;
    padding: 0 0.2rem;
    margin-bottom: 0.2rem;
  }
  .layerItem {
    width: 25px;
    height: 25px;
    margin: 2.5px;
    text-align: center;
    font-weight: 500;
    color: $fontSubColor;
    border-radius: 2px;
    border: $fontSubColor solid 1px;
    cursor: pointer;
    &.selected {
      border: $successColor solid 1px;
      background-color: $successColor;
      color: white;
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
