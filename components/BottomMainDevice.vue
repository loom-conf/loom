<template>
  <div class="deviceSetting">
    <div class="item">
      <div class="header">Load keyboard config</div>
      <div class="containt">
        <AtomInput
          v-model="jsonURL"
          label="JSON URL"
          class="textField"
        ></AtomInput>
        <AtomButton
          :disabled="isLoading"
          class="jsonButton"
          @click="jsonButtonClicked"
          >load</AtomButton
        >
        <AtomButton :disabled="isLoading || true">open local</AtomButton>
      </div>
      <div v-if="indexedHistory" class="history">
        <table class="historyTable">
          <tr
            v-for="history in pinnedHistory"
            :key="`pinned${history.name}${history.index}`"
          >
            <td
              :class="{ enable: history.isPinned }"
              class="pin"
              @click="clickHistoryPin(history.index)"
            >
              ★
            </td>
            <td class="name">{{ history.name }}</td>
            <td class="src">
              <a :href="history.src">{{ history.src }}</a>
            </td>
          </tr>
        </table>
      </div>
      <AtomToggleSlide v-if="indexedHistory" class="history" label="History"
        ><table class="historyTable">
          <tr
            v-for="history in indexedHistory"
            :key="`history${history.name}${history.index}`"
          >
            <td
              :class="{ enable: history.isPinned }"
              class="pin"
              @click="clickHistoryPin(history.index)"
            >
              ★
            </td>
            <td class="name">{{ history.name }}</td>
            <td class="src">
              <a :href="history.src">{{ history.src }}</a>
            </td>
            <td
              v-if="!history.isPinned"
              class="remove"
              @click="clickRemoveHistory(history.index)"
            >
              ×
            </td>
          </tr>
        </table></AtomToggleSlide
      >
    </div>
    <div v-if="hasConfig" class="info">
      Loaded - {{ configName }} / <a :href="configSrc">src</a>
    </div>
    <div class="item">
      <div class="header">Connect USB device</div>
      <div class="containt">
        <AtomButton
          :disabled="!hasConfig || isConnected"
          @click="connectButtonClicked"
          >connect</AtomButton
        >
        <div v-if="isConnected" class="info">Connected - {{ deviceName }}</div>
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
.jsonButton {
  margin: 0 0.3rem;
}
.history {
  .historyTable {
    .pin {
      cursor: pointer;
      color: $disableColor;
      &.enable {
        color: $successColor;
      }
    }
    .name {
      cursor: pointer;
      padding: 0 16px 0 0;
      font-weight: 500;
    }
    .src {
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: x-small;
    }
  }
}
</style>

<script lang="ts">
import axios from 'axios'
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import { useKeyboard } from '@/stores/useKeyboard'
import AtomInput from '@/components/atoms/AtomInput.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'
import AtomToggleSlide from '@/components/atoms/AtomToggleSlide.vue'

interface State {
  jsonURL: string
  isLoading: boolean
}

export default defineComponent({
  components: { AtomInput, AtomButton, AtomToggleSlide },
  setup(_props, _context) {
    const state = reactive<State>({
      jsonURL:
        'https://gist.githubusercontent.com/hsgw/b9df17b75f12d53e025416af3bd227d8/raw/c8db14f146f685fa81f93d54ee4e7f5e041a191a/tartan.json',
      isLoading: false,
    })

    const {
      connectDevice,
      loadKeyboardConfig,
      hasConfig,
      isConnected,
      keyboadConfig,
      deviceConfig,
      indexedHistory,
      updateHistory,
      toggleHistoryPin,
      removeHistory,
    } = useKeyboard()

    const jsonButtonClicked = async () => {
      try {
        state.isLoading = true
        const url = new URL(state.jsonURL)
        const res = await axios.get(url.toString())
        await loadKeyboardConfig(res.data, state.jsonURL)
        updateHistory({
          name: keyboadConfig.value?.name ?? '',
          src: state.jsonURL,
        })
      } catch (e) {
        console.error(e)
      } finally {
        state.isLoading = false
      }
    }

    const connectButtonClicked = async () => {
      try {
        await connectDevice()
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
      ...toRefs(state),
      indexedHistory,
      hasConfig,
      isConnected,
      jsonButtonClicked,
      connectButtonClicked,
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
