<template>
  <div class="editorBottom">
    <div class="tabContainer">
      <EditorBottomTab
        name="Device"
        :selected="bottomTabState"
        @click="selectBottomTab"
      />
      <EditorBottomTab
        name="Keymap"
        :selected="bottomTabState"
        @click="selectBottomTab"
      />
      <EditorBottomTab
        name="Layout"
        :selected="bottomTabState"
        @click="selectBottomTab"
      />
      <EditorBottomTab
        name="App"
        :selected="bottomTabState"
        @click="selectBottomTab"
      />
    </div>
    <div class="mainContainer">
      <div style="height: 0">
        <KeyboardConfig />
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
  .tabContainer {
    width: 150px;
    margin-top: 0.5rem;
  }
  .mainContainer {
    border-top-left-radius: 10px;
    background-color: white;
    overflow-y: auto;
    height: 100%;
    width: 100%;
    padding-left: 2em;
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { BottomTabState, useApp } from '@/stores/useApp'
import EditorBottomTab from '@/components/EditorBottomTab.vue'
import KeyboardConfig from '@/components/KeyboardConfig.vue'

export default defineComponent({
  components: { EditorBottomTab, KeyboardConfig },
  setup(_props, _context) {
    const { setBottomTab, bottomTabState } = useApp()
    const selectBottomTab = (value: BottomTabState) => {
      setBottomTab(value)
    }
    return { selectBottomTab, bottomTabState }
  },
})
</script>
