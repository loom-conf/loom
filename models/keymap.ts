import { buildKeycodeFromRaw } from '@/utils/keycode'
import { KeycodeTypes } from '@/utils/keycodeTypes'

export type Keymap = Array<KeycodeTypes>

export function buildKeymapFromRaw(array: Uint16Array): Array<KeycodeTypes> {
  return Array.from(array, (v) => {
    return buildKeycodeFromRaw(v)
  })
}

export function convertKeymapToRaw(keymap: Array<KeycodeTypes>): Uint16Array {
  return new Uint16Array(keymap.map((v) => v.raw))
}
