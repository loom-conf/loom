<template>
  <div class="keySetting">
    <div class="item">
      <div class="label">Layer</div>
      <SettingLayer :layer="keycode.layer" @changeLayer="changeLayer" />
    </div>
    <div v-if="keycode.kind === 'LAYER_MOD'" class="item">
      <div class="label">Mod</div>
      <SettingMod
        :mods-key="keycode.mods"
        :option="false"
        @changeMods="changeMods"
      />
    </div>
    <div v-if="keycode.kind === 'LAYER_TAP'" class="item">
      <div class="label">Key</div>
      <SettingBase :base-keycode="keycode.base" @changeBase="changeBase" />
    </div>
    <div class="item">
      <div class="label">Raw</div>
      <SettingRaw :raw="keycode.raw" @changeRaw="changeRaw" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { AllLayerKeycodeTypes, BaseKeycode, ModKey } from '@/utils/keycodeTypes'
import SettingLayer from '@/components/keySettings/SettingLayer.vue'
import SettingRaw from '@/components/keySettings/SettingRaw.vue'
import SettingMod from '@/components/keySettings/SettingMod.vue'
import SettingBase from '@/components/keySettings/SettingBase.vue'

export default defineComponent({
  components: { SettingRaw, SettingLayer, SettingMod, SettingBase },
  props: {
    keycode: {
      type: Object as PropType<AllLayerKeycodeTypes>,
      required: true,
    },
  },
  setup(_props, _context) {
    const changeRaw = (newRaw: number) => {
      _context.emit('changeRaw', newRaw)
    }
    const changeBase = (newBase: BaseKeycode) => {
      if (_props.keycode.kind !== 'LAYER_TAP') return
      const newKeycode = { ..._props.keycode }
      newKeycode.base = newBase
      _context.emit('changeKeycode', newKeycode)
    }
    const changeMods = (newMods: ModKey[]) => {
      if (_props.keycode.kind !== 'LAYER_MOD') return
      const newKeycode = { ..._props.keycode }
      newKeycode.mods = newMods
      _context.emit('changeKeycode', newKeycode)
    }
    const changeLayer = (newLayer: number) => {
      const newKeycode = { ..._props.keycode }
      newKeycode.layer = newLayer
      _context.emit('changeKeycode', newKeycode)
    }
    return { changeBase, changeMods, changeRaw, changeLayer }
  },
})
</script>
