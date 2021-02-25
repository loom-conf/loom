<template>
  <div class="editorSideMenu">
    <div class="title">LAYER</div>
    <div
      v-for="n of computedLayerCount"
      :key="n"
      :class="getLayerItemClass(n).value"
      @click="layerItemClicked(n)"
    >
      {{ n - 1 }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layerItem {
  width: 20px;
  height: 20px;
  margin: 2.5px;
  font-size: small;
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
</style>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    currentLayer: {
      type: Number,
      required: true,
    },
    layerCount: {
      type: Number,
      default: undefined,
    },
  },
  setup(_props, _context) {
    const computedLayerCount = computed(() => _props.layerCount ?? 4)

    const getLayerItemClass = (n: number) =>
      computed(() =>
        n === _props.currentLayer + 1
          ? ['layerItem', 'selected']
          : ['layerItem']
      )

    const layerItemClicked = (n: number) => {
      _context.emit('change', n - 1)
    }

    return { computedLayerCount, getLayerItemClass, layerItemClicked }
  },
})
</script>
