import { KeycodeKindType } from '@/utils/keycodeTypes'

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

export function getKeyComponent(kind: KeycodeKindType) {
  switch (kind) {
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
}
