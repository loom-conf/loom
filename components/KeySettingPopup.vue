<template>
  <AtomModal :is-open="isOpen" @close="closeKeySetting">
    <div class="keySettingPopup" :style="positionStyle">
      <div class="keySetting">
        <div class="title">{{ title }}</div>
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
        <div v-if="keycode" class="item">
          <div class="label">Raw</div>
          <SettingRaw :raw="keycode.raw" @changeRaw="changeRaw" />
        </div>
      </div>
    </div>
  </AtomModal>
</template>

<style lang="scss" scoped>
.keySettingPopup {
  position: fixed;
  background-color: white;
  margin-top: 4px;
  padding: 1rem;
  border: 1px solid $bgColor;
  border-radius: 3px;
  box-shadow: 5px 5px rgba(black, 0.3);
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useKeySettingPopup } from '@/stores/useKeySettingPopup'
import { BaseKeycode, ModKey } from '@/utils/keycodeTypes'
import AtomModal from '@/components/atoms/AtomModal.vue'
import SettingBase from '@/components/keySettings/SettingBase.vue'
import SettingRaw from '@/components/keySettings/SettingRaw.vue'
import SettingMod from '@/components/keySettings/SettingMod.vue'
import SettingLayer from '@/components/keySettings/SettingLayer.vue'

export default defineComponent({
  components: {
    AtomModal,
    SettingBase,
    SettingRaw,
    SettingMod,
    SettingLayer,
  },
  props: {},
  setup(_props, _context) {
    const {
      popupWidth,
      isOpen,
      keycode,
      position,
      closeKeySetting,
      setRaw,
      setKeycode,
    } = useKeySettingPopup()

    const positionStyle = computed(() =>
      position.value?.isRight
        ? {
            width: `${popupWidth}px`,
            top: `${position.value?.y}px`,
            left: `${position.value?.x}px`,
          }
        : {
            width: `${popupWidth}px`,
            top: `${position.value?.y}px`,
            right: `${position.value?.x}px`,
          }
    )

    const title = computed(() => keycode.value?.kind.replaceAll('_', ' '))

    const changeBase = (newBase: BaseKeycode) => {
      if (keycode.value && 'base' in keycode.value) {
        const newKeycode = { ...keycode.value }
        newKeycode.base = newBase
        setKeycode(newKeycode)
      }
    }

    const changeMods = (newMods: ModKey[]) => {
      if (keycode.value && 'mods' in keycode.value) {
        const newKeycode = { ...keycode.value }
        newKeycode.mods = newMods
        setKeycode(newKeycode)
      }
    }

    const changeLayer = (newLayer: number) => {
      if (keycode.value && 'layer' in keycode.value) {
        const newKeycode = { ...keycode.value }
        newKeycode.layer = newLayer
        setKeycode(newKeycode)
      }
    }

    const changeRaw = (newRaw: number) => {
      setRaw(newRaw)
    }

    const hasBase = computed(() =>
      keycode.value ? 'base' in keycode.value : undefined
    )
    const hasMods = computed(() =>
      keycode.value ? 'mods' in keycode.value : undefined
    )
    const hasLayer = computed(() =>
      keycode.value ? 'layer' in keycode.value : undefined
    )

    return {
      isOpen,
      keycode,
      closeKeySetting,
      positionStyle,
      title,
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
