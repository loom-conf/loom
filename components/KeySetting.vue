<template>
  <div class="keySetting">
    <div v-if="hasLayer" class="item">
      <div class="label">Layer</div>
      <SettingLayer :layer="keycode.layer" @changeLayer="changeLayer" />
    </div>
    <div v-if="hasBase" class="item">
      <div class="label">Key</div>
      <SettingBase :base-keycode="keycode.base" @changeBase="changeBase" />
    </div>
    <div v-if="hasMods" class="item">
      <div class="label">Mod</div>
      <SettingMod
        :mods-key="keycode.mods"
        :option="keycode.kind !== 'LAYER_MOD'"
        @changeMods="changeMods"
      />
    </div>
    <div class="item">
      <div class="label">Raw</div>
      <SettingRaw :raw="keycode.raw" @changeRaw="changeRaw" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { BaseKeycode, KeycodeTypes, ModKey } from '@/utils/keycodeTypes'
import SettingBase from '@/components/keySettings/SettingBase.vue'
import SettingRaw from '@/components/keySettings/SettingRaw.vue'
import SettingMod from '@/components/keySettings/SettingMod.vue'
import SettingLayer from '@/components/keySettings/SettingLayer.vue'

export default defineComponent({
  components: { SettingBase, SettingRaw, SettingMod, SettingLayer },
  props: {
    keycode: {
      type: Object as PropType<KeycodeTypes>,
      required: true,
    },
  },
  setup(_props, _context) {
    const changeBase = (newBase: BaseKeycode) => {
      if ('base' in _props.keycode) {
        const newKeycode = { ..._props.keycode }
        newKeycode.base = newBase
        _context.emit('changeKeycode', newKeycode)
      }
    }

    const changeMods = (newMods: ModKey[]) => {
      if ('mods' in _props.keycode) {
        const newKeycode = { ..._props.keycode }
        newKeycode.mods = newMods
        _context.emit('changeKeycode', newKeycode)
      }
    }

    const changeLayer = (newLayer: number) => {
      if ('layer' in _props.keycode) {
        const newKeycode = { ..._props.keycode }
        newKeycode.layer = newLayer
        _context.emit('changeKeycode', newKeycode)
      }
    }

    const changeRaw = (newRaw: number) => {
      _context.emit('changeRaw', newRaw)
    }

    const hasBase = computed(() => 'base' in _props.keycode)
    const hasMods = computed(() => 'mods' in _props.keycode)
    const hasLayer = computed(() => 'layer' in _props.keycode)

    return {
      changeBase,
      changeMods,
      changeRaw,
      changeLayer,
      hasBase,
      hasMods,
      hasLayer,
    }
  },
})
</script>
