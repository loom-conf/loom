import { QmkKeycode } from '@/utils/keycodeTypes'

declare module '*/qmkKeycodes.json' {
  const value: QmkKeycode[]
  export default value
}
