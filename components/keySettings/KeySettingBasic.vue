<template>
  <div class="keySetting basic">
    <div class="item">
      <div class="label">Key</div>
      <SettingBase :base-keycode="keycode.base" @changeBase="changeBase" />
    </div>
    <div v-if="isEnabledMods" class="item">
      <div class="label">Mod</div>
      <SettingMod :mods-key="keycode.mods" @changeMods="changeMods" />
    </div>
    <div class="item">
      <div class="label">Raw</div>
      <SettingRaw :raw="keycode.raw" @changeRaw="changeRaw" />
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
import SettingBase from '@/components/keySettings/SettingBase.vue'
import SettingRaw from '@/components/keySettings/SettingRaw.vue'
import SettingMod from '@/components/keySettings/SettingMod.vue'

export default defineComponent({
  components: { SettingBase, SettingRaw, SettingMod },
  props: {
    keycode: {
      type: Object as PropType<BasicKeycode | SpecialKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    const changeBase = (newBase: BaseKeycode) => {
      const newKeycode = { ..._props.keycode }
      newKeycode.base = newBase
      _context.emit('changeKeycode', newKeycode)
    }
    const changeMods = (newMods: ModKey[]) => {
      if (_props.keycode.kind !== 'BASIC') return
      const newKeycode = { ..._props.keycode }
      newKeycode.mods = newMods
      _context.emit('changeKeycode', newKeycode)
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
    return { changeBase, changeMods, changeRaw, isEnabledMods }
  },
})
</script>
