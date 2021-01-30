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
      <KeyboardEditor class="keyboardEditor" />
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
import { defineComponent } from '@nuxtjs/composition-api'

import { provideKeyboard } from '@/stores/useKeyboard'
import KeyboardEditor from '~/components/KeyboardEditor.vue'

export default defineComponent({
  components: { KeyboardEditor },
  setup() {
    provideKeyboard()
    return {}
  },
})
</script>
