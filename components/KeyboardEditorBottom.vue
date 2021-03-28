<template>
  <div class="editorBottom">
    <div class="tabs">
      <BottomTab name="Device" :selected="selectedTab" @click="clickTab" />
      <BottomTab name="Keymap" :selected="selectedTab" @click="clickTab" />
      <BottomTab name="Layout" :selected="selectedTab" @click="clickTab" />
      <BottomTab name="App" :selected="selectedTab" @click="clickTab" />
    </div>
    <div class="main">
      <div style="height: 0">
        <transition name="main-fade" mode="out-in">
          <component :is="mainComponents" />
        </transition>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.editorBottom {
  position: relative;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  .tabs {
    margin-top: 0.25rem;
  }
  .main {
    background-color: $mainBgColor;
    border: 10px solid black;
    border-radius: 12px;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    padding-left: 1rem;
    .item {
      margin-bottom: 1rem;
      .header {
        font-size: larger;
        font-weight: 600;
        margin-bottom: 0.3rem;
      }
      .containt {
        align-items: center;
        margin: 0.3rem 0;
        font-size: large;
        .label {
          padding-right: 1rem;
        }
        .row {
          display: flex;
        }
      }
      .info {
        margin: 6px 0;
        font-size: medium;
        .label {
          font-weight: 500;
          background-color: $successColor;
          color: white;
          padding: 0 12px;
          &.error {
            background-color: $errorColor;
          }
        }
        .msg {
          padding: 0 6px;
        }
      }
    }
  }
}

.main-fade-enter-active,
.main-fade-leave-active {
  transition: opacity 0.1s;
}
.main-fade-enter,
.main-fade-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import BottomTab from '@/components/BottomTab.vue'
import BottomMainDevice from '@/components/BottomMainDevice.vue'
import BottomMainLayout from '@/components/BottomMainLayout.vue'
import BottomMainApp from '@/components/BottomMainApp.vue'
import BottomKeymapPicker from '~/components/BottomKeymapPicker.vue'

export type BottomTabNames = 'Device' | 'Keymap' | 'Layout' | 'App'

export default defineComponent({
  components: {
    BottomTab,
    BottomMainDevice,
    BottomMainLayout,
    BottomKeymapPicker,
  },
  setup(_props, _context) {
    const selectedTab = ref<BottomTabNames>('Device')
    const clickTab = (value: BottomTabNames) => {
      selectedTab.value = value
    }
    const mainComponents = computed(() => {
      switch (selectedTab.value) {
        case 'Device':
          return BottomMainDevice
        case 'Layout':
          return BottomMainLayout
        case 'App':
          return BottomMainApp
        case 'Keymap':
          return BottomKeymapPicker
        default:
          return undefined
      }
    })
    return { selectedTab, clickTab, mainComponents }
  },
})
</script>
