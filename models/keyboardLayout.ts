import * as kle from '@ijprest/kle-serial'

interface Matrix {
  matrix: {
    row: number
    col: number
  }
}

export type LayoutKey = kle.Key & Matrix

export type KeyboardLayout = LayoutKey[]

export module KeyboardLayoutBuilder {
  export function BuildFromKLE(kleLayouts: any[]): KeyboardLayout {
    return kle.Serial.deserialize(kleLayouts).keys.map((key) => {
      const matrix = {
        row: parseInt(key.labels[0].split(',')[0]),
        col: parseInt(key.labels[0].split(',')[1]),
      }
      return { ...key, matrix }
    })
  }
}
