<template>
  <div class="deviceSetting">
    <div class="item">
      <div class="header">Connect USB device</div>
      <div class="containt">
        <AtomButton
          :disabled="isConnected || isCommunicating"
          @click="clickConnect"
          >connect</AtomButton
        >
        <AtomButton
          :disabled="!isConnected || isCommunicating"
          @click="clickDisconnect"
          >disconnect</AtomButton
        >
        <div v-if="isConnected" class="info">
          <span class="label">Connected</span>
          <span class="msg">{{ deviceName }} </span>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="header">Load keyboard config</div>
      <div class="containt">
        <div class="row">
          <AtomInput
            v-model="jsonUrl"
            label="JSON URL"
            class="textField"
          ></AtomInput>
          <AtomButton
            :disabled="isCommunicating"
            class="jsonFetchButton"
            @click="clickLoad"
            >load</AtomButton
          >
          <AtomButton :disabled="isCommunicating" @click="clickOpenLocal"
            >local</AtomButton
          >
          <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            style="display: none"
            @change="changeFileInput"
          />
        </div>
      </div>
      <div v-if="indexedHistory" class="pinned">
        <BottomConfigHistory
          :history="pinnedHistory"
          @clickPin="clickHistoryPin"
          @clickName="clickHistoryName"
          @clickRemove="clickRemoveHistory"
        />
      </div>
      <AtomToggleSlide
        v-if="indexedHistory"
        :value="true"
        class="history"
        label="History"
      >
        <BottomConfigHistory
          :history="indexedHistory"
          @clickPin="clickHistoryPin"
          @clickName="clickHistoryName"
          @clickRemove="clickRemoveHistory"
        />
      </AtomToggleSlide>
      <div v-if="!!configName" class="info">
        <span class="label">Loaded</span>
        <span class="msg">{{ configName }} / <a :href="configSrc">src</a></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.deviceSetting {
  padding: 1rem 0 2rem 0;
}
.textField {
  width: 500px;
}
.jsonFetchButton {
  margin: 0 0.3rem;
}
.pinned {
  font-size: medium;
  .historyTable {
    border: none;
    padding-left: 0;
    margin-left: 0;
    tr {
      line-height: 20px;
    }
  }
}
.history {
  font-size: small;
  margin-left: 4px;
  margin-bottom: 12px;
  .historyTable {
    border-left: 2px solid $fontSubColor;
    padding-left: 5px;
    margin-left: 5px;
    tr {
      line-height: 20px;
    }
  }
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import AtomInput from '@/components/atoms/AtomInput.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'
import AtomToggleSlide from '@/components/atoms/AtomToggleSlide.vue'
import BottomConfigHistory from '@/components/BottomConfigHistory.vue'

export default defineComponent({
  components: {
    AtomInput,
    AtomButton,
    AtomToggleSlide,
    BottomConfigHistory,
  },
  setup(_props, _context) {
    const fileInputRef = ref<HTMLInputElement>()
    const jsonUrl = ref(
      'https://gist.githubusercontent.com/hsgw/b9df17b75f12d53e025416af3bd227d8/raw/c8db14f146f685fa81f93d54ee4e7f5e041a191a/tartan.json'
    )

    const {
      connectDevice,
      disconnectDevice,
      fetchKeybordConfig,
      loadKeyboardConfig,
      isConnected,
      isCommunicating,
      keyboadConfig,
      deviceConfig,
      indexedHistory,
      toggleHistoryPin,
      removeHistory,
    } = useKeyboard()

    const loadConfig = async () => {
      isCommunicating.value = true
      await fetchKeybordConfig(jsonUrl.value)
      isCommunicating.value = false
    }

    const clickLoad = async () => {
      await loadConfig()
    }

    const clickOpenLocal = () => {
      fileInputRef.value?.click()
    }

    const changeFileInput = async (e: any) => {
      function loadJson() {
        return new Promise((resolve) => {
          const fileReader = new FileReader()
          fileReader.onload = (e) => {
            resolve(e.target?.result)
          }
          fileReader.readAsText(file)
        })
      }

      const file = e.target.files[0]
      if (!file) return
      const result = await loadJson()
      loadKeyboardConfig(JSON.parse(result as string), 'local')
    }

    const clickConnect = async () => {
      await connectDevice()
    }

    const clickDisconnect = async () => {
      await disconnectDevice()
    }

    const clickHistoryPin = (index: number) => {
      toggleHistoryPin(index)
    }

    const clickHistoryName = async (src: string) => {
      if (src === 'local') return
      jsonUrl.value = src
      await loadConfig()
    }

    const clickRemoveHistory = (index: number) => {
      removeHistory(index)
    }

    const pinnedHistory = computed(() =>
      indexedHistory.value.filter((v) => v.isPinned)
    )

    const configName = computed(() => keyboadConfig.value?.name)
    const deviceName = computed(() => deviceConfig.value?.name)
    const configSrc = computed(() => keyboadConfig.value?.fileSrc)

    return {
      fileInputRef,
      jsonUrl,
      isCommunicating,
      indexedHistory,
      isConnected,
      clickConnect,
      clickDisconnect,
      clickLoad,
      clickOpenLocal,
      changeFileInput,
      clickHistoryPin,
      clickHistoryName,
      clickRemoveHistory,
      pinnedHistory,
      configName,
      deviceName,
      configSrc,
    }
  },
})
</script>
