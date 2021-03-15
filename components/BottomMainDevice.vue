<template>
  <div class="deviceSetting">
    <div class="item">
      <div class="header">Connect USB device</div>
      <div class="containt">
        <AtomButton :disabled="isConnected" @click="clickConnect"
          >connect</AtomButton
        >
        <AtomButton :disabled="!isConnected" @click="clickDisconnect"
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
            :disabled="isLoading"
            class="jsonFetchButton"
            @click="clickLoad"
            >load</AtomButton
          >
          <AtomButton :disabled="isLoading || true">open local</AtomButton>
        </div>
      </div>
      <div v-if="indexedHistory" class="pinned">
        <BottomConfigHistory
          :history="pinnedHistory"
          @clickPin="clickHistoryPin"
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
  height: 0;
  min-width: 250px;
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
import axios from 'axios'
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
    const jsonUrl = ref(
      'https://gist.githubusercontent.com/hsgw/b9df17b75f12d53e025416af3bd227d8/raw/c8db14f146f685fa81f93d54ee4e7f5e041a191a/tartan.json'
    )
    const isLoading = ref(false)

    const {
      connectDevice,
      disconnectDevice,
      loadKeyboardConfig,
      isConnected,
      keyboadConfig,
      deviceConfig,
      indexedHistory,
      updateHistory,
      toggleHistoryPin,
      removeHistory,
    } = useKeyboard()

    const clickLoad = async () => {
      try {
        isLoading.value = true
        const url = new URL(jsonUrl.value)
        const res = await axios.get(url.toString())
        await loadKeyboardConfig(res.data, jsonUrl.value)
        updateHistory({
          name: keyboadConfig.value?.name ?? '',
          src: jsonUrl.value,
        })
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }
    }

    const clickConnect = async () => {
      try {
        await connectDevice()
      } catch (e) {
        console.error(e)
      }
    }

    const clickDisconnect = async () => {
      try {
        await disconnectDevice()
      } catch (e) {
        console.error(e)
      }
    }

    const clickHistoryPin = (index: number) => {
      toggleHistoryPin(index)
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
      jsonUrl,
      isLoading,
      indexedHistory,
      isConnected,
      clickLoad,
      clickConnect,
      clickDisconnect,
      clickHistoryPin,
      clickRemoveHistory,
      pinnedHistory,
      configName,
      deviceName,
      configSrc,
    }
  },
})
</script>
