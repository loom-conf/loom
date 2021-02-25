<template>
  <div>
    <h1>{{ keyboardName }}</h1>
    <div class="keymapEditor">
      <div class="sideMenu">
        <KeymapEditorLayerSelector
          :current-layer="currentLayer"
          :layer-count="layerCount"
          @change="layerChange"
        />
        <KeymapEditorUsb @upload="uploadToDevice" />
      </div>
      <KeymapViewer />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keymapEditor {
  flex: 1;
  display: flex;
  .sideMenu {
    div:first-child {
      margin-bottom: 1rem;
    }
  }
}
</style>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import { useKeymap } from '@/stores/useKeymap'
import KeymapEditorLayerSelector from '@/components/KeymapEditorLayerSelector.vue'
import KeymapEditorUsb from '@/components/KeymapEditorUsb.vue'
import KeymapViewer from '@/components/KeymapViewer.vue'

export default defineComponent({
  components: {
    KeymapEditorLayerSelector,
    KeymapEditorUsb,
    KeymapViewer,
  },
  setup(_props, _context) {
    const {
      keyboadConfig,
      deviceConfig,
      loadDeviceSetting,
      uploadKeymap,
    } = useKeyboard()
    const { setCurrentLayer, currentLayer, getKeymapAsRawArray } = useKeymap()

    const keyboardName = computed(() => keyboadConfig.value?.name)

    const layerCount = computed(() => deviceConfig.value?.layerCount)

    const layerChange = (layer: number) => {
      setCurrentLayer(layer)
    }

    const uploadToDevice = async () => {
      console.log('flash')
      await uploadKeymap(new Uint16Array(getKeymapAsRawArray()))
      await loadDeviceSetting()
      console.log('done')
    }

    return {
      currentLayer,
      keyboardName,
      layerCount,
      layerChange,
      uploadToDevice,
    }
  },
})
</script>
