<template>
  <div class="keySetting">
    <div class="item">
      <div class="label">Layer</div>
      <SettingLayer :layer="keycode.layer" @change="changeLayer" />
    </div>
    <div class="item">
      <div class="label">Raw</div>
      <SettingRaw :raw="keycode.raw" @change-raw="changeRaw" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { LayerKeycodeTypes } from '@/utils/keycodeTypes'
import SettingLayer from '@/components/keySettings/SettingLayer.vue'
import SettingRaw from '@/components/keySettings/SettingRaw.vue'

export default defineComponent({
  components: { SettingRaw, SettingLayer },
  props: {
    keycode: {
      type: Object as PropType<LayerKeycodeTypes>,
      required: true,
    },
  },
  setup(_props, _context) {
    const changeRaw = (newRaw: number) => {
      _context.emit('changeRaw', newRaw)
    }
    const changeLayer = (newLayer: number) => {
      _context.emit('changeLayer', newLayer)
    }
    return { changeRaw, changeLayer }
  },
})
</script>
