<template>
  <div class="editorBottom">
    <div class="tabContainer">
      <div class="tab">DEVICE</div>
      <div class="tab">KEYMAP</div>
      <div class="tab">LAYOUT</div>
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
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: stretch;
  flex-direction: row;
  .tabContainer {
    .tab {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 3rem;
      width: 150px;
      font-weight: bolder;
      letter-spacing: 0.3rem;
    }
  }
  .mainContainer {
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
import KeyboardConfig from '@/components/KeyboardConfig.vue'

interface State {}

export default defineComponent({
  components: { KeyboardConfig },
  setup(_props, _context) {
    return {}
  },
})
</script>
