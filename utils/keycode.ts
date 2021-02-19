import { KeycodeTypes, QmkKeycode, ModKey } from '@/utils/keycodeTypes'

const list: Array<QmkKeycode> = require('@/utils/QMKKeycodes.json')

function findBase(code: number) {
  return list.find((keycode) => keycode.raw === code)
}

function parseModsToArray(mods: number): Array<ModKey> {
  const parsed = []
  const which = mods & 0x10 ? 'R' : 'L'
  if (mods & 0x01) parsed.push(which + 'CTL')
  if (mods & 0x02) parsed.push(which + 'SFT')
  if (mods & 0x04) parsed.push(which + 'ALT')
  if (mods & 0x08) parsed.push(which + 'GUI')

  return parsed as Array<ModKey>
}

function joinModsArrayToString(array: Array<ModKey>): string {
  return array.map<string>((v) => `MOD_${v}`).join('|')
}

export function buildKeycodeFromRaw(raw: number): KeycodeTypes {
  if (raw <= 0x1fff) {
    // basic + mod
    const mods = parseModsToArray(raw >> 8)
    const base = findBase(raw & 0x00ff)
    return base
      ? {
          kind: 'BASIC',
          qmk: mods.reduce((ret, v) => `${v}(${ret})`, base.qmk),
          raw,
          base,
          mods,
        }
      : {
          kind: 'UNKNOWN',
          raw,
        }
  } else if (raw <= 0x2fff) {
    // func
    return {
      kind: 'FUNCTION',
      qmk: `F(${raw & 0x0fff})`,
      raw,
      action: raw & 0xfff,
    }
  } else if (raw <= 0x3fff) {
    // macro
    return {
      kind: 'MACRO',
      qmk: `M(${raw & 0x0fff})`,
      raw,
      macro: raw & 0x0fff,
    }
  } else if (raw <= 0x4fff) {
    // tap keycode, hold layer
    const base = findBase(raw & 0xff)
    const layer = (raw & 0x0f00) >> 8
    return base
      ? {
          kind: `LAYER_TAP`,
          qmk: `LT(${layer},${base.qmk})`,
          raw,
          tap: base,
          layer,
        }
      : {
          kind: 'UNKNOWN',
          raw,
        }
  } else if (raw <= 0x50ff) {
    // turn on layer
    const layer = raw & 0x00f
    return {
      kind: 'LAYER_ON',
      qmk: `TO(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x51ff) {
    // momentary layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_MOMENTARY',
      qmk: `MO(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x52ff) {
    // set default layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_DEFAULT',
      qmk: `DF(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x53ff) {
    // toggle layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_TOGGLE',
      qmk: `TG(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x54ff) {
    // one shot layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_ONESHOT',
      qmk: `OSL(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x55ff) {
    // one shot mod
    const mods = parseModsToArray(raw & 0xff)
    return {
      kind: 'MOD_ONESHOT',
      qmk: `OSM(${joinModsArrayToString(mods)})`,
      raw,
      mods,
    }
  } else if (raw <= 0x56ff) {
    return {
      kind: 'UNKNOWN',
      raw,
    }
  } else if (raw <= 0x57ff) {
    const tapdance = raw & 0xff
    return {
      kind: 'TAPDANCE',
      qmk: `TD(${tapdance})`,
      raw,
      tapdance,
    }
  } else if (raw <= 0x58ff) {
    // tap toggle layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_TAPTOGGLE',
      qmk: `TT(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x59ff) {
    // momentaly switch layer with modifier (left mod only)
    const mods = parseModsToArray(raw & 0x0f)
    const layer = (raw & 0xf0) >> 4
    return {
      kind: 'LAYER_MOD',
      qmk: `LM(${layer}, ${joinModsArrayToString(mods)})`,
      raw,
      layer,
      mods,
    }
  } else if (raw <= 0x5bff) {
    return {
      kind: 'UNKNOWN',
      raw,
    }
  } else if (raw >= 0x6000 && raw <= 0x7fff) {
    // mod tap
    const mods = parseModsToArray((raw & 0x1f00) >> 8)
    const tap = findBase(raw & 0xff)
    return tap
      ? {
          kind: 'MOD_TAP',
          qmk: `MT(${joinModsArrayToString(mods)}, tap.qmk)`,
          raw,
          tap,
          mods,
        }
      : {
          kind: 'UNKNOWN',
          raw,
        }
  }
  return {
    kind: 'UNKNOWN',
    raw,
  }
}

// no need to implement??????
// function BuildFromQMK(str: string): Keycode | undefined {
//   const parsed = str
//     .replace(/\)/g, '')
//     .split('(')
//     .reduce<{ baseKeyName: string; mod: Array<ModKey> }>(
//       (ret, value) => {
//         // check mods
//         if (['S', 'LSFT'].includes(value)) ret.mod.push('LSFT')
//         else if (['RSFT'].includes(value)) ret.mod.push('RSFT')
//         else if (['C', 'LCTL'].includes(value)) ret.mod.push('LCTL')
//         else if (['RCTL'].includes(value)) ret.mod.push('RCTL')
//         else if (['A', 'LAlt'].includes(value)) ret.mod.push('LALT')
//         else if (['RALT'].includes(value)) ret.mod.push('RALT')
//         else if (['G', 'LGUI'].includes(value)) ret.mod.push('LGUI')
//         else if (['RGUI'].includes(value)) ret.mod.push('RGUI')
//         // check MO
//         else ret.baseKeyName = value
//         return ret
//       },
//       { baseKeyName: '', mod: [] }
//     )
//   if (!parsed.baseKeyName) return undefined
//   return undefined
// }
