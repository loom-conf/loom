<template>
  <div class="initialPane">
    <h1>LOOM Configulator - beta</h1>
    <p>Keyboard keymap configulator on a browser.</p>
    <h2>How to use</h2>
    <li>Open Device tab</li>
    <li>Load VIA compatible config file</li>
    <li>(If you have real keyboard) Connect keyboard</li>
    <h2>If you get an error</h2>
    <p>
      Please report
      <a href="https://github.com/loom-conf/loom/issues"
        >https://github.com/loom-conf/loom/issues</a
      >
    </p>
    <h2>Source code</h2>
    <p>
      <a href="https://github.com/loom-conf/loom/"
        >https://github.com/loom-conf/loom/</a
      >
    </p>
    <h2>License</h2>
    <p>
      Please see
      <a href="https://github.com/loom-conf/loom/blob/master/LICENSE"
        >https://github.com/loom-conf/loom/blob/master/LICENSE</a
      >
    </p>
  </div>
</template>

<style lang="scss" scoped>
.initialPane {
  padding: 0 24px 24px 16px;
  background-color: white;
  border: 10px solid black;
  border-radius: 10px;
  h1 {
    font-size: xx-large;
    font-weight: 900;
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup(_props, _context) {
    return {}
  },
})
</script>
