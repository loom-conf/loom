<template>
  <div class="keymapEditorBorder">
    <div class="keymapEditorContainer">
      <div class="keyboardName">{{ keyboardName }}</div>
      <div class="keymapEditor">
        <div class="sideMenuContainer">
          <KeymapEditorLayerSelector
            :current-layer="currentLayer"
            :layer-count="layerCount"
            class="sideMenu"
            @change="layerChange"
          />
          <KeymapEditorUsbMenu
            :is-connected="isConnected"
            :is-communicating="isCommunicating"
            class="sideMenu"
            @upload="clickUpload"
            @connect="clickConnect"
            @disconnect="clickDisconnect"
          />
        </div>
        <KeymapViewer
          :class="{ blur: isCommunicating }"
          style="transition: filter 0.3s linear"
        />
      </div>
      <div v-if="isCommunicating" class="loading">
        <AtomLoader />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.keymapEditorBorder {
  background-color: white;
  border: 10px solid black;
  border-radius: 12px;
  transition: filter 0.5s linear;
  max-width: 100%;
  overflow-x: auto;
  .keymapEditorContainer {
    position: relative;
    padding: 0 24px 24px 16px;
    filter: none;
    .keyboardName {
      margin-left: -6px;
      margin-top: 3px;
      line-height: 60px;
      font-size: 48px;
      font-weight: 900;
    }
    .keymapEditor {
      position: relative;
      flex: 1;
      display: flex;
      .sideMenuContainer {
        div:first-child {
          margin-bottom: 1rem;
        }
        .sideMenu {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 15px;
          .title {
            font-size: small;
            border-bottom: 1px solid $fontSubColor;
            padding: 0 0.2rem;
            margin-bottom: 0.2rem;
          }
        }
      }
    }
    .loading {
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
import KeymapEditorUsbMenu from '@/components/KeymapEditorUsbMenu.vue'
import KeymapViewer from '@/components/KeymapViewer.vue'
import AtomLoader from '@/components/atoms/AtomLoader.vue'

export default defineComponent({
  components: {
    KeymapEditorLayerSelector,
    KeymapEditorUsbMenu,
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
      isConnected,
      connectDevice,
      disconnectDevice,
    } = useKeyboard()
    const { setCurrentLayer, currentLayer, getKeymapAsRawArray } = useKeymap()

    const keyboardName = computed(() => keyboadConfig.value?.name)

    const layerCount = computed(() => deviceConfig.value?.layerCount)

    const layerChange = (layer: number) => {
      setCurrentLayer(layer)
    }

    const clickConnect = async () => {
      await connectDevice()
    }

    const clickDisconnect = async () => {
      await disconnectDevice()
    }

    const clickUpload = async () => {
      await uploadKeymap(new Uint16Array(getKeymapAsRawArray()))
      await loadDeviceSetting()
    }

    return {
      currentLayer,
      keyboardName,
      layerCount,
      layerChange,
      clickConnect,
      clickDisconnect,
      clickUpload,
      isCommunicating,
      isConnected,
    }
  },
})
</script>
