<template>
  <div v-if="isVisible" class="keyContainer" :style="outerStyle" @click="click">
    <div ref="keyRef" class="keyBorder" :class="isDisabled ? 'disabled' : ''">
      <div v-if="keycode === undefined">{{ label }}</div>
      <component :is="keyComponent" v-else :keycode="keycode" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keyContainer {
  position: absolute;
  z-index: 1000;
  padding: 0.5px;
  user-select: none;
  .keyBorder {
    display: flex;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border: $bgColor 1px solid;
    border-radius: 2px;
    &.disabled {
      background-color: $disableColor;
      color: lighten($disableColor, 50%);
    }
  }
}
</style>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
} from '@nuxtjs/composition-api'
import { KeyLayout } from '@/models/keyboardLayout'
import { KeycodeTypes } from '@/utils/keycodeTypes'
import { useConsts } from '@/stores/useConsts'
import { useAppSetting } from '@/stores/useAppSetting'
import { useKeySettingPopup } from '@/stores/useKeySettingPopup'

import UnknownKey from '@/components/keys/UnknownKey.vue'
import BasicKey from '@/components/keys/BasicKey.vue'
import SpecialKey from '@/components/keys/SpecialKey.vue'
import FunctionKey from '@/components/keys/FunctionKey.vue'
import MacroKey from '@/components/keys/MacroKey.vue'
import LayerTapKey from '@/components/keys/LayerTapKey.vue'
import LayerModKey from '@/components/keys/LayerModKey.vue'
import LayerKey from '@/components/keys/LayerKey.vue'
import ModTapKey from '@/components/keys/ModTapKey.vue'
import OneshotModKey from '@/components/keys/OneshotModKey.vue'

export default defineComponent({
  props: {
    keyLayout: {
      type: Object as PropType<KeyLayout>,
      required: true,
    },
    keycode: {
      type: Object as PropType<KeycodeTypes>,
      required: false,
    },
    keycodeIndex: {
      type: Number,
      required: false,
    },
  },

  setup(_props, _context) {
    const keyRef = ref<HTMLDivElement>()

    const { KeyConsts, calcKeySize } = useConsts()
    const { viewerOption } = useAppSetting()
    const { popupWidth, openKeySetting } = useKeySettingPopup()

    const width = computed(() => calcKeySize(_props.keyLayout.width))
    const height = computed(() => calcKeySize(_props.keyLayout.height))
    const top = computed(
      () => calcKeySize(_props.keyLayout.y) + KeyConsts.margin
    )
    const left = computed(
      () => calcKeySize(_props.keyLayout.x) + KeyConsts.margin
    )

    const outerStyle = computed(() => {
      return {
        width: `${width.value}px`,
        height: `${height.value}px`,
        top: `${top.value}px`,
        left: `${left.value}px`,
        'transform-origin': `${calcKeySize(
          _props.keyLayout.rotation_x - _props.keyLayout.x
        )}px
        ${calcKeySize(_props.keyLayout.rotation_y - _props.keyLayout.y)}px`,
        transform: `rotate(${_props.keyLayout.rotation_angle}deg)`,
      }
    })

    const label = computed(() => {
      if (_props.keycode === undefined) return _props.keyLayout.labels[0]
      return 'qmk' in _props.keycode ? _props.keycode.qmk : _props.keycode.raw
    })

    const keyComponent = computed(() => {
      switch (_props.keycode?.kind) {
        case 'BASIC':
          return BasicKey
        case 'SPECIAL':
          return SpecialKey
        case 'FUNCTION':
          return FunctionKey
        case 'MACRO':
          return MacroKey
        case 'LAYER_TAP':
          return LayerTapKey
        case 'LAYER_MOD':
          return LayerModKey
        case 'LAYER_ON':
        case 'LAYER_MOMENTARY':
        case 'LAYER_DEFAULT':
        case 'LAYER_TOGGLE':
        case 'LAYER_ONESHOT':
        case 'LAYER_TAPTOGGLE':
          return LayerKey
        case 'MOD_ONESHOT':
          return OneshotModKey
        case 'MOD_TAP':
          return ModTapKey
        case 'TAPDANCE':
        case 'UNKNOWN':
          return UnknownKey
        default:
          return undefined
      }
    })

    const isVisible = computed(
      () =>
        !(viewerOption.hideUnselectedLayout && _props.keyLayout.disabled) &&
        !_props.keyLayout.decal
    )

    const isDisabled = computed(() => _props.keyLayout.disabled)

    const click = () => {
      console.log(_props.keycode?.kind)
      const rect = keyRef.value?.getBoundingClientRect()
      if (rect) {
        const isRight = rect.right + popupWidth < window.innerWidth
        if (_props.keycode) {
          openKeySetting(
            {
              x: isRight ? rect.left : window.innerWidth - rect.right,
              y: rect.bottom,
              isRight,
            },
            _props.keycode,
            (newKeycode) => {
              _context.emit('update-keycode', newKeycode, _props.keycodeIndex)
            }
          )
        }
      }
    }

    return {
      keyRef,
      outerStyle,
      label,
      keyComponent,
      isVisible,
      isDisabled,
      click,
    }
  },
})
</script>
