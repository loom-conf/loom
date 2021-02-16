<template>
  <div class="editorBottom">
    <div class="tabs">
      <EditorBottomTab
        name="Device"
        :selected="selectedTab"
        @click="selectBottomTab"
      />
      <EditorBottomTab
        name="Keymap"
        :selected="selectedTab"
        @click="selectBottomTab"
      />
      <EditorBottomTab
        name="Layout"
        :selected="selectedTab"
        @click="selectBottomTab"
      />
      <EditorBottomTab
        name="App"
        :selected="selectedTab"
        @click="selectBottomTab"
      />
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
  z-index: 50;
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: stretch;
  flex-direction: row;
  .tabs {
    margin-top: 0.25rem;
  }
  .main {
    border-top-left-radius: 10px;
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
import EditorBottomTab from '@/components/EditorBottomTab.vue'
import BottomMainDevice from '@/components/BottomMainDevice.vue'
import BottomMainLayout from '@/components/BottomMainLayout.vue'

export type BottomTabNames = 'Device' | 'Keymap' | 'Layout' | 'App'

export default defineComponent({
  components: { EditorBottomTab, BottomMainDevice, BottomMainLayout },
  setup(_props, _context) {
    const selectedTab = ref<BottomTabNames>('Device')
    const selectBottomTab = (value: BottomTabNames) => {
      selectedTab.value = value
    }
    const mainComponents = computed(() => {
      switch (selectedTab.value) {
        case 'Device':
          return BottomMainDevice
        case 'Layout':
          return BottomMainLayout
      }
      return undefined
    })
    return { selectedTab, selectBottomTab, mainComponents }
  },
})
</script>
