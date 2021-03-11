import { InjectionKey, provide, inject, ref } from '@nuxtjs/composition-api'
import { KeycodeTypes } from '@/utils/keycodeTypes'
import { buildKeycodeFromRaw, buildRawFromKeycode } from '@/utils/keycodes'

interface KeySettingPosition {
  x: number
  y: number
  isRight: boolean
}

type KeySettingUpdateFunc = (newKeycode: KeycodeTypes) => void

export function createKeySettingPopup() {
  const popupWidth = 300
  const isOpen = ref<boolean>(false)
  const keycode = ref<KeycodeTypes>()
  const position = ref<KeySettingPosition>()
  let updateKeycodeFunc: KeySettingUpdateFunc | undefined

  const openKeySetting = (
    pos: KeySettingPosition,
    code: KeycodeTypes,
    updateCallback: KeySettingUpdateFunc
  ) => {
    position.value = pos
    keycode.value = code
    isOpen.value = true
    updateKeycodeFunc = updateCallback
  }

  const closeKeySetting = () => {
    isOpen.value = false
    keycode.value = undefined
    position.value = undefined
    updateKeycodeFunc = undefined
  }

  const setRaw = (raw: number) => {
    keycode.value = buildKeycodeFromRaw(raw)
    if (updateKeycodeFunc) updateKeycodeFunc(keycode.value)
  }

  const setKeycode = (newKeycode: KeycodeTypes) => {
    keycode.value = buildKeycodeFromRaw(buildRawFromKeycode(newKeycode))
    if (updateKeycodeFunc) updateKeycodeFunc(keycode.value)
  }

  const doneKeySetting = () => {
    closeKeySetting()
  }

  return {
    popupWidth,
    isOpen,
    position,
    keycode,
    openKeySetting,
    closeKeySetting,
    doneKeySetting,
    setRaw,
    setKeycode,
  }
}

/* provide/inject */
export const key: InjectionKey<
  ReturnType<typeof createKeySettingPopup>
> = Symbol('KeySettingPopup')

export const provideKeySettingPopup = () => {
  provide(key, createKeySettingPopup())
}

export const useKeySettingPopup = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useKeySettingPopup is not provided')
  else return ret
}
