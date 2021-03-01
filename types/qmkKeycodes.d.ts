import { QmkKeycode } from '@/utils/keycodeTypes'

declare module '*/utils/QmkKeycodes.json' {
  export const value: QmkKeycode[]
}
