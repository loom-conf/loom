<template>
  <div class="keySetting basic">
    <div class="item">
      <div class="label">Key</div>
      <SettingBaseSelect
        :base-keycode="keycode.base"
        @change-base-keycode="changeBaseKeycode"
      />
    </div>
    <div v-if="isEnabledMods" class="item">
      <div class="label">Mod</div>
      <SettingMod :mods-key="keycode.mods" @change-mods="changeMods" />
    </div>
    <div class="item">
      <div class="label">Raw</div>
      <SettingRaw :raw="keycode.raw" @change-raw="changeRaw" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import {
  BaseKeycode,
  BasicKeycode,
  ModKey,
  SpecialKeycode,
} from '@/utils/keycodeTypes'
import SettingBaseSelect from '@/components/keySettings/SettingBase.vue'
import SettingRaw from '@/components/keySettings/SettingRaw.vue'
import SettingMod from '@/components/keySettings/SettingMod.vue'

export default defineComponent({
  components: { SettingBaseSelect, SettingRaw, SettingMod },
  props: {
    keycode: {
      type: Object as PropType<BasicKeycode | SpecialKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    const changeBaseKeycode = (newBaseKeycode: BaseKeycode) => {
      _context.emit('changeBaseKey', newBaseKeycode)
    }
    const changeMods = (newMods: ModKey[]) => {
      _context.emit('changeMods', newMods)
    }
    const changeRaw = (newRaw: number) => {
      _context.emit('changeRaw', newRaw)
    }
    const isEnabledMods = computed(
      () =>
        _props.keycode.base.kind === 'BASIC' ||
        _props.keycode.base.kind === 'KEYPAD' ||
        _props.keycode.base.kind === 'MOD'
    )
    return { changeBaseKeycode, changeMods, changeRaw, isEnabledMods }
  },
})
</script>
