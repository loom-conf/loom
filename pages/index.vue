<template>
  <div>
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
    <div class="container">
      <div class="keyboardEditor">
        <div class="upper">
          <div class="pb-6">
            <v-text-field v-model="jsonURL" label="json"></v-text-field>
            <v-btn @click="loadJSON">load JSON</v-btn>
            <v-btn
              :disabled="keyboard.isConnected.value"
              @click="keyboard.connect"
              >connect</v-btn
            >
            <v-btn
              :disabled="!keyboard.isConnected.value"
              @click="keyboard.disconnect"
              >disconnect</v-btn
            >
          </div>
          <h1>{{ keyboard.name.value }}</h1>
        </div>
        <div class="bottom"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$navigation-drawer-width: 100px;

.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  padding-top: 0;
  padding-left: $navigation-drawer-width;
  margin-left: 30px;
}

.keyboardEditor {
  overflow-x: hidden;
  .upper {
    margin-top: 10px;
  }
  .bottom {
    flex: 1;
    min-height: 200px;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

import useKeyboardHID from '@/composables/useKeyboardHID'
import useKeyboardConfig from '@/composables/useKeyboardConfig'

export default defineComponent({
  setup() {
    const keyboard = useKeyboardHID()
    const keyboardConfig = useKeyboardConfig()

    const jsonURL = ref<string>(
      'https://gist.githubusercontent.com/hsgw/c57055b3fddb58bdc58dddaba5c087e4/raw/15da4f3b5e5b54761f33ec5c45b24e2950040677/meishi2.json'
    )
    const loadJSON = async () => {
      await keyboardConfig.loadJSONFromURL(jsonURL.value)
    }
    return { loadJSON, jsonURL, keyboard, keyboardConfig }
  },
})
</script>
