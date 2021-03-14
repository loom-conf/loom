<template>
  <AtomModal :is-open="isOpen" @close="closeKeySetting">
    <div class="keySettingPopup" :class="colorClass" :style="positionStyle">
      <div class="keySetting">
        <div class="header">
          <div :class="colorClass" class="title">
            {{ title }}
          </div>
          <div v-tooltip.left="'undo'" class="undo" @click.stop="clickUndo">
            <AtomIcon :icon="mdiUndo" />
          </div>
        </div>
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
          <AtomToggleSlide label="Raw">
            <SettingRaw
              :raw="keycode.raw"
              class="settingRaw"
              @changeRaw="changeRaw"
            />
          </AtomToggleSlide>
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
  margin-left: -8px;
  margin-right: -8px;
  border: 8px solid $bgColor;
  border-radius: 3px;
  box-shadow: 5px 5px rgba(black, 0.3);
  &.basic {
    border-color: $basicKeyColor;
  }
  &.layer {
    border-color: $layerKeyColor;
  }
  &.mod {
    border-color: $modKeyColor;
  }
}
.keySetting {
  padding-bottom: 12px;
  .header {
    display: flex;
    justify-content: space-between;
    user-select: none;
    margin: 0 0 8px 8px;
    .title {
      font-weight: 500;
      color: white;
      background-color: $bgColor;
      border-top: none;
      border-radius: 0 0 8px 8px;
      padding: 0 8px 4px 8px;
      &.basic {
        background-color: $basicKeyColor;
      }
      &.layer {
        background-color: $layerKeyColor;
      }
      &.mod {
        background-color: $modKeyColor;
      }
    }
    .undo {
      color: $fontSubColor;
      width: 20px;
      height: 20px;
      margin-top: 4px;
      margin-right: 8px;
      cursor: pointer;
    }
  }
}
</style>

<style lang="scss">
/* for toggle slide */
.keySetting {
  .item {
    margin-bottom: 6px;
    padding: 0 16px;
    .label {
      margin-bottom: 2px;
      user-select: none;
      font-size: small;
      font-weight: 400;
    }
  }
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { useKeySettingPopup } from '@/stores/useKeySettingPopup'
import { BaseKeycode, ModKey } from '@/utils/keycodeTypes'
import { mdiUndo } from '@mdi/js'
import AtomModal from '@/components/atoms/AtomModal.vue'
import AtomIcon from '@/components/atoms/AtomIcon.vue'
import AtomToggleSlide from '@/components/atoms/AtomToggleSlide.vue'
import SettingBase from '@/components/keySettings/SettingBase.vue'
import SettingRaw from '@/components/keySettings/SettingRaw.vue'
import SettingMod from '@/components/keySettings/SettingMod.vue'
import SettingLayer from '@/components/keySettings/SettingLayer.vue'

export default defineComponent({
  components: {
    AtomModal,
    AtomIcon,
    AtomToggleSlide,
    SettingBase,
    SettingRaw,
    SettingMod,
    SettingLayer,
  },
  props: {},
  setup(_props, _context) {
    const isRawOpen = ref(false)
    const {
      popupWidth,
      isOpen,
      keycode,
      position,
      closeKeySetting,
      setRaw,
      setKeycode,
      undo,
    } = useKeySettingPopup()

    const positionStyle = computed(() => {
      if (!position.value) return
      return position.value?.isRight
        ? {
            width: `${popupWidth}px`,
            top: `${position.value.y}px`,
            left: `${position.value.x}px`,
          }
        : {
            width: `${popupWidth}px`,
            top: `${position.value.y}px`,
            right: `${position.value.x}px`,
          }
    })

    const title = computed(() => keycode.value?.kind.replaceAll('_', ' '))

    const colorClass = computed(() => {
      switch (keycode.value?.kind) {
        case 'BASIC':
          return 'basic'
        case 'LAYER_TAP':
        case 'LAYER_MOD':
        case 'LAYER_ON':
        case 'LAYER_MOMENTARY':
        case 'LAYER_DEFAULT':
        case 'LAYER_TOGGLE':
        case 'LAYER_ONESHOT':
        case 'LAYER_TAPTOGGLE':
          return 'layer'
        case 'MOD_ONESHOT':
        case 'MOD_TAP':
          return 'mod'
        case 'SPECIAL':
        case 'FUNCTION':
        case 'MACRO':
        case 'TAPDANCE':
        case 'UNKNOWN':
        default:
          return undefined
      }
    })

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

    const clickUndo = () => {
      undo()
    }

    const clickRawLabel = () => {
      isRawOpen.value = !isRawOpen.value
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
      mdiUndo,
      isRawOpen,
      isOpen,
      keycode,
      closeKeySetting,
      positionStyle,
      title,
      colorClass,
      changeBase,
      changeMods,
      changeRaw,
      changeLayer,
      clickUndo,
      clickRawLabel,
      hasBase,
      hasMods,
      hasLayer,
    }
  },
})
</script>
