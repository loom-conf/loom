<template>
  <div class="keySetting">
    <div class="title">Unknown</div>
    <div class="item">
      <SettingRawCode :raw="keycode.raw" @change="changeRaw" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { UnknownKeycode } from '@/utils/keycodeTypes'
import SettingRawCode from '@/components/keySettings/SettingRawcode.vue'

export default defineComponent({
  components: { SettingRawCode },
  props: {
    keycode: {
      type: Object as PropType<UnknownKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    const changeRaw = (newRaw: number) => {
      _context.emit('changeRawCode', newRaw)
    }
    return { changeRaw }
  },
})
</script>
