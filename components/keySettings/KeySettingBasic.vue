<template>
  <div class="keySetting basic">
    <div class="title">Basic</div>
    <div class="item">
      <SettingBasicSelect :base-keycode="keycode" />
    </div>
    <div class="item">
      <SettingRawCode :raw="keycode.raw" @change="changeRaw" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { UnknownKeycode } from '@/utils/keycodeTypes'
import SettingBasicSelect from '@/components/keySettings/SettingBasicSelect.vue'
import SettingRawCode from '@/components/keySettings/SettingRawcode.vue'

export default defineComponent({
  components: { SettingBasicSelect, SettingRawCode },
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
