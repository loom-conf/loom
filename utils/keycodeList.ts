type ModKey = 'none' | 'LEFT' | 'RIGHT'

export interface Keycode {
  qmk: string
  raw: number
  legend: string
  altLegend?: string
  type: string
  shifted?: ModKey
  alted?: ModKey
}

export class KeycodeList {
  static list: Array<Keycode> = require('@/utils/QMKKeycodes.json')
  static FindByRAW(raw: number): Keycode | undefined {
    return this.list.find((keycode) => keycode.raw === raw)
  }

  static FindByQMK(qmk: string): Keycode | undefined {
    return this.list.find((keycode) => keycode.qmk === qmk)
  }
}
