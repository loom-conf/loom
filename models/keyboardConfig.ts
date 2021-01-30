import { ConfigJSON, Convert } from '@/utils/configJSON'

interface fileSrc {
  fileSrc: string | undefined
}

export type KeyboardConfig = ConfigJSON & fileSrc

export class KeyboardConfigBuilder {
  static BuildFromJSON(json: any): KeyboardConfig {
    return {
      ...Convert.toConfigJSON(json),
      fileSrc: undefined,
    } as const
  }
}
