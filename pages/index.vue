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
      <div class="keyboard">
        <div class="upper">
          <div class="pb-6">
            <v-text-field label="json"></v-text-field>
            <v-btn>load JSON</v-btn>
            <v-btn :disabled="keyboardState.isConnected" @click="connect"
              >connect</v-btn
            >
            <v-btn :disabled="!keyboardState.isConnected" @click="disconnect"
              >disconnect</v-btn
            >
          </div>
          <h1>{{ keyboardState.name }}</h1>
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

.keyboard {
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
import { defineComponent } from '@nuxtjs/composition-api'
import useHidKeyboard from '@/composables/useHidKeyboard'

export default defineComponent({
  setup() {
    const { state: keyboardState, connect, disconnect } = useHidKeyboard()
    return { keyboardState, connect, disconnect }
  },
})
</script>
