<template>
  <div class="main">
    <v-navigation-drawer
      permanent
      app
      class="pt-4"
      color="grey"
      mini-variant
      mini-variant-width="100px"
    >
      LOOM
    </v-navigation-drawer>
    <div class="editorContainer">
      <KeyboardEditor
        id="keyboardEditor"
        :default-json-url="jsonURL"
        :default-keyboard-name="keyboardName"
      />
    </div>
  </div>
</template>

<style lang="scss">
$navigation-drawer-width: 100px;

body::-webkit-scrollbar {
  display: none;
}

.editorContainer {
  margin-left: $navigation-drawer-width;
}

#keyboardEditor {
  overflow: hidden;
  height: 100vh;
}
</style>

<script lang="ts">
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
import KeyboardEditor from '~/components/KeyboardEditor.vue'

export default defineComponent({
  components: { KeyboardEditor },
  setup(_props) {
    const { route } = useContext()
    const keyboardName = computed(() => route.value.params.keyboard ?? '')
    const jsonURL = computed(() => route.value.query.config ?? '')

    return { keyboardName, jsonURL }
  },
})
</script>
