import { ConfigJSON, Convert } from '@/utils/configJSON'

interface fileSrc {
  fileSrc: string | undefined
}

export type KeyboardConfig = ConfigJSON & fileSrc

export module KeyboardConfigBuilder {
  export function BuildFromJSON(json: any): KeyboardConfig {
    return {
      ...Convert.toConfigJSON(json),
      fileSrc: undefined,
    } as const
  }
}
