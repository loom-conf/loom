<template>
  <div class="editorBottom">
    <div class="tabs">
      <BottomTab name="Device" :selected="selectedTab" @click="clickTab" />
      <BottomTab name="Keymap" :selected="selectedTab" @click="clickTab" />
      <BottomTab name="Layout" :selected="selectedTab" @click="clickTab" />
      <BottomTab name="App" :selected="selectedTab" @click="clickTab" />
    </div>
    <div class="main">
      <transition name="main-fade" mode="out-in">
        <component :is="mainComponents" />
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editorBottom {
  position: relative;
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: stretch;
  flex-direction: row;
  .tabs {
    margin-top: 0.25rem;
  }
  .main {
    background-color: $mainBgColor;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    padding-left: 2em;
    padding-top: 1em;
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

export type BottomTabNames = 'Device' | 'Keymap' | 'Layout' | 'App'

export default defineComponent({
  components: { BottomTab, BottomMainDevice, BottomMainLayout },
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
      }
      return undefined
    })
    return { selectedTab, clickTab, mainComponents }
  },
})
</script>
