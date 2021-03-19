<template>
  <div class="editorSideMenu">
    <div class="title">USB</div>
    <div
      v-tooltip.right="!isConnected ? 'Connect' : 'Disconnect'"
      :class="{ connected: isConnected, disabled: isCommunicating }"
      class="item"
      @click="clickUsb"
    >
      <AtomIcon :icon="mdiUsbPort" />
    </div>
    <div
      v-tooltip.right="`Upload`"
      :class="{ disabled: isCommunicating || !isConnected }"
      class="item"
      @click="clickUpload"
    >
      <AtomIcon :icon="mdiUpload" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  width: 25px;
  height: 25px;
  margin: 2.5px;
  text-align: center;
  font-weight: 500;
  color: $subColor;
  border-radius: 2px;
  cursor: pointer;
  &.connected {
    color: $successColor;
  }
  &.disabled {
    color: $disableColor;
    cursor: not-allowed;
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mdiUpload, mdiUsbPort } from '@mdi/js'
import AtomIcon from '@/components/atoms/AtomIcon.vue'

export default defineComponent({
  components: { AtomIcon },
  props: {
    isConnected: { type: Boolean, default: false },
    isCommunicating: { type: Boolean, default: false },
  },
  setup(_props, _context) {
    const clickUsb = () => {
      if (!_props.isCommunicating)
        _context.emit(!_props.isConnected ? 'connect' : 'disconnect')
    }
    const clickUpload = () => {
      if (!_props.isCommunicating) _context.emit('upload')
    }

    return {
      mdiUsbPort,
      mdiUpload,
      clickUsb,
      clickUpload,
    }
  },
})
</script>
