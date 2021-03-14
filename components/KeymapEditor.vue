<template>
  <div class="keymapEditorContainer">
    <div
      :class="{ blur: isCommunicating }"
      style="transition: filter 0.3s linear"
    >
      <div class="keyboardName">{{ keyboardName }}</div>
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
    <div v-if="isCommunicating" class="loadingModal">
      <AtomLoader />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keymapEditorContainer {
  position: relative;
  transition: filter 0.5s linear;
  filter: none;
  .keyboardName {
    margin-left: -10px;
    line-height: 48px;
    font-size: 48px;
    font-weight: 900;
  }
  .keymapEditor {
    position: relative;
    flex: 1;
    display: flex;
    .sideMenu {
      div:first-child {
        margin-bottom: 1rem;
      }
    }
  }
  .loadingModal {
    position: absolute;
    background-color: rgba($color: #fff, $alpha: 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    opacity: 1;
    transition: all 0.3s linear;
  }
}
.blur {
  filter: blur(4px);
}
</style>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import { useKeymap } from '@/stores/useKeymap'
import KeymapEditorLayerSelector from '@/components/KeymapEditorLayerSelector.vue'
import KeymapEditorUsb from '@/components/KeymapEditorUsb.vue'
import KeymapViewer from '@/components/KeymapViewer.vue'
import AtomLoader from '@/components/atoms/AtomLoader.vue'

export default defineComponent({
  components: {
    KeymapEditorLayerSelector,
    KeymapEditorUsb,
    KeymapViewer,
    AtomLoader,
  },
  setup(_props, _context) {
    const {
      keyboadConfig,
      deviceConfig,
      loadDeviceSetting,
      uploadKeymap,
      isCommunicating,
    } = useKeyboard()
    const { setCurrentLayer, currentLayer, getKeymapAsRawArray } = useKeymap()

    const keyboardName = computed(() => keyboadConfig.value?.name)

    const layerCount = computed(() => deviceConfig.value?.layerCount)

    const layerChange = (layer: number) => {
      setCurrentLayer(layer)
    }

    const uploadToDevice = async () => {
      await uploadKeymap(new Uint16Array(getKeymapAsRawArray()))
      await loadDeviceSetting()
    }

    return {
      currentLayer,
      keyboardName,
      layerCount,
      layerChange,
      uploadToDevice,
      isCommunicating,
    }
  },
})
</script>
