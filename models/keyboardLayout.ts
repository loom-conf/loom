import * as kle from '@ijprest/kle-serial'
import { RectPoint, rotateRect } from '@/utils/rotateKey'
import { useConsts } from '@/stores/useConsts'

interface Matrix {
  matrix:
    | {
        row: number
        col: number
      }
    | undefined
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

interface Rotated {
  rotated: RectPoint
}

export type KeyLayout = kle.Key & Matrix & LayoutOption & Disabled & Rotated

export type KeyboardLayout = Array<KeyLayout>

export function buildLayoutFromKLE(kleLayouts: Array<any>): KeyboardLayout {
  const { calcKeySize } = useConsts()
  return kle.Serial.deserialize(kleLayouts)
    .keys.filter((key) => key.labels.length)
    .map((key) => {
      let matrix
      if (key.labels[0]) {
        matrix = {
          row: parseInt(key.labels[0].split(',')[0]),
          col: parseInt(key.labels[0].split(',')[1]),
        }
      }

      const rotated = rotateRect(
        { x: calcKeySize(key.x), y: calcKeySize(key.y) },
        { width: calcKeySize(key.width), height: calcKeySize(key.height) },
        {
          rx: calcKeySize(key.rotation_x),
          ry: calcKeySize(key.rotation_y),
          r: key.rotation_angle,
        }
      )

      let layoutOption
      if (key.labels[8]) {
        layoutOption = {
          layout: parseInt(key.labels[8].split(',')[0]),
          value: parseInt(key.labels[8].split(',')[1]),
        }
      }

      if (layoutOption)
        return { ...key, matrix, layoutOption, disabled: false, rotated }
      else return { ...key, matrix, disabled: false, rotated }
    })
}
