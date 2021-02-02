interface ConfigJSON {
  name: string
  vendorId: string
  productId: string
  lighting: string
  matrix: Matrix
  layouts: Layouts
}

type LayoutLabels = Array<string[] | string>

interface Layouts {
  keymap: Array<Array<KeymapOption | string>>
  labels?: LayoutLabels
}

interface KeymapOption {
  c?: string
  x?: number
  w?: number
  h?: number
  w2?: number
  h2?: number
  x2?: number
}

interface Matrix {
  rows: number
  cols: number
}
