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
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> LOOM </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <template v-slot:append>
        <div class="pa-3">
          <v-btn dark rounded href="https://github.com/loom-conf/loom-conf"
            ><v-icon x-large>mdi-github</v-icon></v-btn
          >
        </div>
      </template>
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
