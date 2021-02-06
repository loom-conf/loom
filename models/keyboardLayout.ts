import * as kle from '@ijprest/kle-serial'

interface Matrix {
  matrix: {
    row: number
    col: number
  }
}

interface LayoutOption {
  layoutOption?: {
    layout: number
    value: number
  }
}

interface Disabled {
  disabled: boolean
}

export type KeyLayout = kle.Key & Matrix & LayoutOption & Disabled

export type KeyboardLayout = Array<KeyLayout>

export function buildLayoutFromKLE(kleLayouts: Array<any>): KeyboardLayout {
  return kle.Serial.deserialize(kleLayouts).keys.map((key) => {
    const matrix = {
      row: parseInt(key.labels[0].split(',')[0]),
      col: parseInt(key.labels[0].split(',')[1]),
    }

    let layoutOption
    if (key.labels[8]) {
      layoutOption = {
        layout: parseInt(key.labels[8].split(',')[0]),
        value: parseInt(key.labels[8].split(',')[1]),
      }
    }

    if (layoutOption) return { ...key, matrix, layoutOption, disabled: false }
    else return { ...key, matrix, disabled: false }
  })
}
