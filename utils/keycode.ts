type ModKey =
  | 'LSFT'
  | 'RSFT'
  | 'LCTL'
  | 'RCTL'
  | 'LALT'
  | 'RALT'
  | 'RGUI'
  | 'LGUI'

interface BaseKeycode {
  qmk: string
  raw: number
  legend: string
  altLegend?: string
  type: string
}

type KeycodeType =
  | 'BASIC'
  | 'FUNCTION'
  | 'MACRO'
  | 'LAYER_TAP'
  | 'LAYER_ON'
  | 'LAYER_MOMENTARY'
  | 'LAYER_DEFAULT'
  | 'LAYER_TOGGLE'
  | 'LAYER_ONESHOT'
  | 'MOD_ONESHOT'
  | 'TAPDANCE'
  | 'LAYER_TAPTOGGLE'
  | 'LAYER_MOD'
  | 'MOD_TAP'

interface Keycode {
  type: KeycodeType
  qmk: string
  raw: number
}

export type BasicKeycode = Keycode & { base: BaseKeycode; mods: Array<ModKey> }
export type ActionKeycode = Keycode & { action: number }
export type LayerKeycode = Keycode & { layer: number }
export type LayerTapKeycode = Keycode & { layer: number; tap: BaseKeycode }
export type LayerModKeycode = Keycode & { layer: number; mods: Array<ModKey> }
export type OneshotModKeycode = Keycode & { mods: Array<ModKey> }
export type TapDanceKeycode = Keycode & { tapdance: number }
export type ModTapKeycode = Keycode & { tap: BaseKeycode; mods: Array<ModKey> }

export class KeycodeBuilder {
  private static list: Array<BaseKeycode> = require('@/utils/QMKKeycodes.json')

  static BuildFromRAW(
    raw: number
  ):
    | BasicKeycode
    | ActionKeycode
    | LayerTapKeycode
    | LayerKeycode
    | OneshotModKeycode
    | LayerModKeycode
    | TapDanceKeycode
    | ModTapKeycode
    | undefined {
    const findBase = (code: number) =>
      this.list.find((keycode) => keycode.raw === code)

    const parseModsToArray = (mods: number): Array<ModKey> => {
      const parsed = []
      if (mods & 0x01) parsed.push('CTL')
      if (mods & 0x02) parsed.push('SFT')
      if (mods & 0x04) parsed.push('ALT')
      if (mods & 0x08) parsed.push('GUI')

      if (mods & 0x10) return parsed.map((v) => 'R' + v) as Array<ModKey>
      return parsed.map((v) => 'L' + v) as Array<ModKey>
    }

    const joinModsArrayToString = (array: Array<ModKey>): string =>
      array.map<string>((v) => `MOD_${v}`).join('|')

    if (raw <= 0x1fff) {
      // basic + mod
      const mods = parseModsToArray(raw >> 8)
      const base = findBase(raw & 0x00ff)

      return base
        ? {
            type: 'BASIC',
            qmk: mods.reduce((ret, v) => `${v}(${ret})`, base.qmk),
            raw,
            base,
            mods,
          }
        : undefined
    } else if (raw <= 0x2fff) {
      // func
      return {
        type: 'FUNCTION',
        qmk: `F(${raw & 0x0fff})`,
        raw,
        action: raw & 0xfff,
      }
    } else if (raw <= 0x3fff) {
      // macro
      return {
        type: 'MACRO',
        qmk: `M(${raw & 0x0fff})`,
        raw,
        action: raw & 0x0fff,
      }
    } else if (raw <= 0x4fff) {
      // tap keycode, hold layer
      const base = findBase(raw & 0xff)
      const layer = (raw & 0x0f00) >> 8
      return base
        ? {
            type: `LAYER_TAP`,
            qmk: `LT(${layer},${base.qmk})`,
            raw,
            tap: base,
            layer,
          }
        : undefined
    } else if (raw <= 0x50ff) {
      // turn on layer
      const layer = raw & 0x00ff
      return {
        type: 'LAYER_ON',
        qmk: `TO(${layer})`,
        raw,
        layer,
      }
    } else if (raw <= 0x51ff) {
      // momentary layer
      const layer = raw & 0x00ff
      return {
        type: 'LAYER_MOMENTARY',
        qmk: `MO(${layer})`,
        raw,
        layer,
      }
    } else if (raw <= 0x52ff) {
      // set default layer
      const layer = raw & 0x00ff
      return {
        type: 'LAYER_DEFAULT',
        qmk: `DF(${layer})`,
        raw,
        layer,
      }
    } else if (raw <= 0x53ff) {
      // toggle layer
      const layer = raw & 0x00ff
      return {
        type: 'LAYER_TOGGLE',
        qmk: `TG(${layer})`,
        raw,
        layer,
      }
    } else if (raw <= 0x54ff) {
      // one shot layer
      const layer = raw & 0x00ff
      return {
        type: 'LAYER_ONESHOT',
        qmk: `OSL(${layer})`,
        raw,
        layer,
      }
    } else if (raw <= 0x55ff) {
      // one shot mod
      const mods = parseModsToArray(raw & 0xff)
      return {
        type: 'MOD_ONESHOT',
        qmk: `OSM(${joinModsArrayToString(mods)})`,
        raw,
        mods,
      }
    } else if (raw <= 0x56ff) {
      return undefined
    } else if (raw <= 0x57ff) {
      const tapdance = raw & 0xff
      return {
        type: 'TAPDANCE',
        qmk: `TD(${tapdance})`,
        raw,
        tapdance,
      }
    } else if (raw <= 0x58ff) {
      // tap toggle layer
      const layer = raw & 0x00ff
      return {
        type: 'LAYER_TAPTOGGLE',
        qmk: `TT(${layer})`,
        raw,
        layer,
      }
    } else if (raw <= 0x59ff) {
      // momentaly switch layer with modifier (left mod only)
      const mods = parseModsToArray(raw & 0x0f)
      const layer = (raw & 0xf0) >> 4
      return {
        type: 'LAYER_MOD',
        qmk: `LM(${layer}, ${joinModsArrayToString(mods)})`,
        raw,
        layer,
        mods,
      }
    } else if (raw <= 0x5bff) {
      return undefined
    } else if (raw <= 0x7fff) {
      // mod tap
      const mods = parseModsToArray((raw & 0x1f00) >> 8)
      const tap = findBase(raw & 0xff)
      return tap
        ? {
            type: 'MOD_TAP',
            qmk: `MT(${joinModsArrayToString(mods)}, tap.qmk)`,
            raw,
            tap,
            mods,
          }
        : undefined
    }
    return undefined
  }

  // no need to implement??????
  // static BuildFromQMK(str: string): Keycode | undefined {
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
}
