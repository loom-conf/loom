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

export function buildLayoutFromKLE(kleLayouts: Array<any>): KeyLayout[] {
  const { calcKeySize } = useConsts()

  const defaultOrigins: { layout: number; row: number; left: number }[] = []
  const clusterOrigins: {
    layout: number
    value: number
    row: number
    left: number
  }[] = []

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

      const layoutOption = key.labels[8]
        ? {
            layout: parseInt(key.labels[8].split(',')[0]),
            value: parseInt(key.labels[8].split(',')[1]),
          }
        : undefined

      // check origin position for layout option keys
      if (layoutOption) {
        if (layoutOption.value === 0) {
          const storedIndex = defaultOrigins.findIndex(
            (origin) =>
              origin.layout === layoutOption.layout && origin.row === key.y
          )
          if (storedIndex === -1) {
            defaultOrigins.push({
              layout: layoutOption.layout,
              row: key.y,
              left: key.x,
            })
          } else if (defaultOrigins[storedIndex].left > key.x) {
            defaultOrigins[storedIndex].left = key.x
          }
        } else {
          const storedIndex = clusterOrigins.findIndex(
            (origin) =>
              origin.layout === layoutOption.layout &&
              origin.value === layoutOption.value &&
              origin.row === key.y
          )
          if (storedIndex === -1) {
            clusterOrigins.push({
              layout: layoutOption.layout,
              value: layoutOption.value,
              row: key.y,
              left: key.x,
            })
          } else if (clusterOrigins[storedIndex].left > key.x) {
            clusterOrigins[storedIndex].left = key.x
          }
        }
      }

      return { ...key, matrix, layoutOption, disabled: false }
    })
    .map((key) => {
      if (key.layoutOption && key.layoutOption.value !== 0) {
        const matchedDefaultOrigins = defaultOrigins.filter(
          (v) => v.layout === key.layoutOption?.layout
        )
        const defaultOrigin =
          matchedDefaultOrigins.length === 1
            ? matchedDefaultOrigins[0]
            : matchedDefaultOrigins.find((v) => v.row === key.y)
        const clusterOrigin = clusterOrigins.find(
          (v) =>
            v.layout === key.layoutOption?.layout &&
            v.value === key.layoutOption.value &&
            v.row === key.y
        )
        if (defaultOrigin && clusterOrigin) {
          key.x = key.x + (defaultOrigin.left - clusterOrigin.left)
          key.y = key.y + (defaultOrigin.row - clusterOrigin.row)
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
      return { ...key, rotated }
    })
}
