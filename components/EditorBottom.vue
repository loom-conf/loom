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
      <div style="height: 0">
        <BottomMainDevice v-show="selectedTab === 'Device'" />
        <BottomMainLayout v-show="selectedTab === 'Layout'" />
      </div>
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
    background-color: white;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    padding-left: 2em;
    padding-top: 1em;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
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
    return { selectedTab, selectBottomTab }
  },
})
</script>
