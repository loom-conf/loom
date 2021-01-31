import { ConfigJSON, Convert } from '@/utils/configJSON'

interface FileSrc {
  fileSrc: string | undefined
}

export type KeyboardConfig = ConfigJSON & FileSrc

export function buildKeyboardConfigFromJSON(json: any): KeyboardConfig {
  return {
    ...Convert.toConfigJSON(json),
    fileSrc: undefined,
  } as const
}
