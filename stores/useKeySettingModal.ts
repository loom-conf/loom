import { InjectionKey, provide, inject, ref } from '@nuxtjs/composition-api'
import { Point } from '@/utils/rotateKey'
import { KeycodeTypes } from '@/utils/keycodeTypes'
import { buildKeycodeFromRaw } from '@/utils/keycode'

interface KeySettingDoneCallback {
  (newKeycode: KeycodeTypes): void
}

export function createKeySettingModal() {
  const isOpen = ref<boolean>(false)
  const keycode = ref<KeycodeTypes>()
  const position = ref<Point>()
  let callback: KeySettingDoneCallback | undefined

  const openKeySetting = (
    pos: Point,
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
  ReturnType<typeof createKeySettingModal>
> = Symbol('KeySettingModal')

export const provideKeySettingModal = () => {
  provide(key, createKeySettingModal())
}

export const useKeySettingModal = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useKeySettingModal is not provided')
  else return ret
}
