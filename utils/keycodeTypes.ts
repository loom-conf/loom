export type ModKey =
  | 'LSFT'
  | 'RSFT'
  | 'LCTL'
  | 'RCTL'
  | 'LALT'
  | 'RALT'
  | 'RGUI'
  | 'LGUI'

export interface QmkKeycode {
  qmk: string
  raw: number
  legend: string
  altLegend?: string
  type: string
}

export interface UnknownKeycode {
  kind: 'UNKNOWN'
  raw: number
}

export interface BasicKeycode {
  kind: 'BASIC'
  qmk: string
  raw: number
  base: QmkKeycode
  mods: ModKey[]
}

export interface FunctionKeycode {
  kind: 'FUNCTION'
  qmk: string
  raw: number
  action: number
}

export interface MacroKeycode {
  kind: 'MACRO'
  qmk: string
  raw: number
  macro: number
}

export interface LayerTapKeycode {
  kind: 'LAYER_TAP'
  qmk: string
  raw: number
  layer: number
  tap: QmkKeycode
}

export interface LayerOnKeycode {
  kind: 'LAYER_ON'
  qmk: string
  raw: number
  layer: number
}

export interface LayerMomentaryKeycode {
  kind: 'LAYER_MOMENTARY'
  qmk: string
  raw: number
  layer: number
}

export interface LayerDefaultKeycode {
  kind: 'LAYER_DEFAULT'
  qmk: string
  raw: number
  layer: number
}

export interface LayerToggleKeycode {
  kind: 'LAYER_TOGGLE'
  qmk: string
  raw: number
  layer: number
}

export interface LayerOneshotKeycode {
  kind: 'LAYER_ONESHOT'
  qmk: string
  raw: number
  layer: number
}

export interface OneshotModKeycode {
  kind: 'MOD_ONESHOT'
  qmk: string
  raw: number
  mods: ModKey[]
}

export interface TapdanceKeycode {
  kind: 'TAPDANCE'
  qmk: string
  raw: number
  tapdance: number
}

export interface LayerTapToggleKeycode {
  kind: 'LAYER_TAPTOGGLE'
  qmk: string
  raw: number
  layer: number
}

export interface LayerModKeycode {
  kind: 'LAYER_MOD'
  qmk: string
  raw: number
  layer: number
  mods: ModKey[]
}

export interface ModTapKeycode {
  kind: 'MOD_TAP'
  qmk: string
  raw: number
  tap: QmkKeycode
  mods: ModKey[]
}

type KeycodeKind =
  | 'UNKNOWN'
  | 'BASIC'
  | 'ACTION'
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

export type KeycodeTypes =
  | UnknownKeycode
  | BasicKeycode
  | FunctionKeycode
  | MacroKeycode
  | LayerTapKeycode
  | LayerOnKeycode
  | LayerMomentaryKeycode
  | LayerDefaultKeycode
  | LayerToggleKeycode
  | LayerOneshotKeycode
  | OneshotModKeycode
  | TapdanceKeycode
  | LayerTapToggleKeycode
  | LayerModKeycode
  | ModTapKeycode
