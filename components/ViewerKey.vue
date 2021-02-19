<template>
  <div v-if="isVisible" class="keyContainer" :style="outerStyle" @click="click">
    <div class="keyBorder" :class="isDisabled ? 'disabled' : ''">
      <div v-if="keycode === undefined">{{ label }}</div>
      <component :is="keyComponent" v-else :keycode="keycode" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keyContainer {
  z-index: 10;
  position: absolute;
  overflow: hidden;
  padding: 0.5px;
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
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { KeyLayout } from '@/models/keyboardLayout'
import { KeycodeTypes } from '@/utils/keycodeTypes'
import { useConsts } from '@/stores/useConsts'
import { useAppSetting } from '@/stores/useAppSetting'

import UnknownKey from '@/components/keys/UnknownKey.vue'
import BasicKey from '@/components/keys/BasicKey.vue'
import FunctionKey from '@/components/keys/FunctionKey.vue'
import MacroKey from '@/components/keys/MacroKey.vue'
import LayerTapKey from '@/components/keys/LayerTapKey.vue'
import LayerModKey from '@/components/keys/LayerModKey.vue'
import LayerKey from '@/components/keys/LayerKey.vue'

export default defineComponent({
  props: {
    keyLayout: {
      type: Object as PropType<KeyLayout>,
      required: true,
    },
    keycode: {
      type: Object as PropType<KeycodeTypes> | undefined,
      default: undefined,
    },
  },

  setup(props, _context) {
    const { KeyConsts, calcKeySize } = useConsts()
    const { viewerOption } = useAppSetting()

    const outerStyle = computed(() => {
      return {
        width: calcKeySize(props.keyLayout.width) + 'px',
        height: calcKeySize(props.keyLayout.height) + 'px',
        top: `${calcKeySize(props.keyLayout.y) + KeyConsts.margin}px`,
        left: `${calcKeySize(props.keyLayout.x) + KeyConsts.margin}px`,
        'transform-origin': `${calcKeySize(
          props.keyLayout.rotation_x - props.keyLayout.x
        )}px
        ${calcKeySize(props.keyLayout.rotation_y - props.keyLayout.y)}px`,
        transform: `rotate(${props.keyLayout.rotation_angle}deg)`,
      }
    })

    const label = computed(() => {
      if (props.keycode === undefined) return props.keyLayout.labels[0]
      return 'qmk' in props.keycode ? props.keycode.qmk : props.keycode.raw
    })

    const keyComponent = computed(() => {
      switch (props.keycode.kind) {
        case 'BASIC':
          return BasicKey
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
        case 'TAPDANCE':
        case 'MOD_TAP':
        case 'UNKNOWN':
          return UnknownKey
        default:
          return undefined
      }
    })

    const isVisible = computed(
      () =>
        !(viewerOption.hideUnselectedLayout && props.keyLayout.disabled) &&
        !props.keyLayout.decal
    )

    const isDisabled = computed(() => props.keyLayout.disabled)

    const click = () => {
      console.log(props.keycode)
    }

    return { outerStyle, label, keyComponent, isVisible, isDisabled, click }
  },
})
</script>
