import * as kle from '@ijprest/kle-serial'

export interface MatrixPos {
  matrixPos: {
    row: number
    col: number
  }
}

export type LayoutKey = kle.Key & MatrixPos

export class KeyboardLayout {
  static ConvertFromKLE = (layouts: any[]): LayoutKey[] =>
    kle.Serial.deserialize(layouts).keys.map((key) => {
      const matrixPos = {
        row: parseInt(key.labels[0].split(',')[0]),
        col: parseInt(key.labels[0].split(',')[1]),
      }
      return { ...key, matrixPos }
    })
}
