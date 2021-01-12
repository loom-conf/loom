import { Convert as ConvertFromJSON, KeyboardJSON } from '@/utils/keyboardJSON'

// illegal extend from https://qiita.com/pentamania/items/200e4c09285c01f8917f
type Weaken<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? any : T[P]
}

interface LayoutKeymap {
  row: number
  col: number
}

export interface KeyboardConfig extends Weaken<KeyboardJSON, 'layouts'> {
  layouts: Array<LayoutKeymap[]>
}
