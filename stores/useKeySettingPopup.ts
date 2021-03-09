import { InjectionKey, provide, inject, ref } from '@nuxtjs/composition-api'
import { KeycodeTypes } from '@/utils/keycodeTypes'
import { buildKeycodeFromRaw } from '@/utils/keycodes'

interface KeySettingDoneCallback {
  (newKeycode: KeycodeTypes): void
}

interface KeySettingPosition {
  x: number
  y: number
  isRight: boolean
}

export function createKeySettingPopup() {
  const popupWidth = 300
  const isOpen = ref<boolean>(false)
  const keycode = ref<KeycodeTypes>()
  const position = ref<KeySettingPosition>()
  let callback: KeySettingDoneCallback | undefined

  const openKeySetting = (
    pos: KeySettingPosition,
    code: KeycodeTypes,
    callbackFunc: KeySettingDoneCallback
  ) => {
    position.value = pos
    keycode.value = code
    isOpen.value = true
    callback = callbackFunc
  }

  const closeKeySetting = () => {
    isOpen.value = false
    keycode.value = undefined
    position.value = undefined
    callback = undefined
  }

  const setRawCode = (raw: number) => {
    keycode.value = buildKeycodeFromRaw(raw)
  }

  const doneKeySetting = () => {
    if (keycode.value && callback) callback(keycode.value)
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
    setRawCode,
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
