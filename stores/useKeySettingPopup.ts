import { InjectionKey, provide, inject, ref } from '@nuxtjs/composition-api'
import { KeycodeTypes } from '@/utils/keycodeTypes'
import { buildKeycodeFromRaw, buildRawFromKeycode } from '@/utils/keycodes'

interface KeySettingPosition {
  x: number
  y: number
  isRight: boolean
}

type UpdateCallback = (newKeycode: KeycodeTypes) => void
type CloseCallBack = () => void

export function createKeySettingPopup() {
  const popupWidth = 300
  const isOpen = ref<boolean>(false)
  const keycode = ref<KeycodeTypes>()
  const position = ref<KeySettingPosition>()
  let originalKeycode: KeycodeTypes | undefined
  let updateCallbackFunc: UpdateCallback | undefined
  let closeCallbackFunc: CloseCallBack | undefined

  const openKeySetting = (
    pos: KeySettingPosition,
    code: KeycodeTypes,
    updateCallback: UpdateCallback,
    closeCallback: CloseCallBack
  ) => {
    position.value = pos
    keycode.value = code
    isOpen.value = true
    originalKeycode = code
    updateCallbackFunc = updateCallback
    closeCallbackFunc = closeCallback
  }

  const closeKeySetting = () => {
    if (closeCallbackFunc) closeCallbackFunc()
    isOpen.value = false
    keycode.value = undefined
    position.value = undefined
    originalKeycode = undefined
    updateCallbackFunc = undefined
    closeCallbackFunc = undefined
  }

  const setRaw = (raw: number) => {
    keycode.value = buildKeycodeFromRaw(raw)
    if (updateCallbackFunc) updateCallbackFunc(keycode.value)
  }

  const setKeycode = (newKeycode: KeycodeTypes) => {
    keycode.value = buildKeycodeFromRaw(buildRawFromKeycode(newKeycode))
    if (updateCallbackFunc) updateCallbackFunc(keycode.value)
  }

  const undo = () => {
    keycode.value = originalKeycode
    if (updateCallbackFunc && keycode.value) updateCallbackFunc(keycode.value)
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
    undo,
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
