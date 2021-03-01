import { QmkKeycode } from '@/utils/keycodeTypes'

declare module '*/qmkKeycodes.json' {
  export const value: QmkKeycode[]
}
