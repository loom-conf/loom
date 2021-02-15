<template>
  <div class="main">
    <div class="navContainer">
      <div class="nav">LOOM</div>
    </div>
    <KeyboardEditor
      class="keyboardEditor"
      :default-json-url="jsonURL"
      :default-keyboard-name="keyboardName"
    />
  </div>
</template>

<style lang="scss">
body::-webkit-scrollbar {
  display: none;
}

.main {
  background-color: silver;
  width: 100vw;
  height: 100vh;
  .navContainer {
    position: relative;
    z-index: 10;
    .nav {
      text-align: center;
      position: absolute;
      width: 100px;
      height: 100vh;
    }
  }
}

.keyboardEditor {
  overflow: hidden;
  width: 100%;
  height: 100vh;
}
</style>

<script lang="ts">
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
import KeyboardEditor from '~/components/KeyboardEditor.vue'

export default defineComponent({
  components: { KeyboardEditor },
  setup(_props, _context) {
    const { route } = useContext()
    const keyboardName = computed(() => route.value.params.keyboard ?? '')
    const jsonURL = computed(() => route.value.query.config ?? '')

    return { keyboardName, jsonURL }
  },
})
</script>
