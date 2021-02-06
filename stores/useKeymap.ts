import {
  inject,
  InjectionKey,
  provide,
  reactive,
  ref,
} from '@nuxtjs/composition-api'
import { KeyboardLayout, buildLayoutFromKLE } from '@/models/keyboardLayout'
import { buildKeymapFromRaw, Keymap } from '@/models/keymap'
import { KeycodeTypes } from '@/utils/keycode'
import { DeviceSetting } from '@/models/deviceSetting'
import { LayoutOption } from '@/models/layoutOption'
import { KeyboardConfig } from '@/models/keyboardConfig'

export const createKeymap = () => {
  const keymap = ref<Keymap>([])
  const layout = ref<KeyboardLayout>([])
  const layoutOption = reactive<LayoutOption>(new LayoutOption())

  function setKeyboardConfig(keyboardConfig: KeyboardConfig | undefined) {
    if (!keyboardConfig?.layouts.keymap) layout.value = []
    else layout.value = buildLayoutFromKLE(keyboardConfig.layouts.keymap)
    layoutOption.setLabels(keyboardConfig?.layouts.labels)
    applyLayoutOption()
    layoutOption.setRawSetting(0)
  }

  function setDeviceSetting(setting: DeviceSetting | undefined) {
    keymap.value = setting?.keymap ? buildKeymapFromRaw(setting.keymap) : []
    layoutOption.setRawSetting(setting?.layoutOption ?? 0)
  }

  function setKeycode(index: number, keycode: KeycodeTypes) {
    keymap.value[index] = keycode
  }

  function applyLayoutOption() {
    layout.value = layout.value.map((item) => {
      if (!item.layoutOption || !layoutOption.items) {
        item.disabled = false
      } else if (
        layoutOption.items[item.layoutOption.layout].value !==
        item.layoutOption.value
      ) {
        item.disabled = true
      } else {
        item.disabled = false
      }
      return item
    })
  }

  function changeLayoutOption(index: number, value: number) {
    if (layoutOption.items) {
      layoutOption.items[index].value = value
      applyLayoutOption()
    }
  }

  return {
    keymap,
    layout,
    layoutOption,
    setKeycode,
    setKeyboardConfig,
    setDeviceSetting,
    changeLayoutOption,
  }
}

/* provide/inject */
export const key: InjectionKey<ReturnType<typeof createKeymap>> = Symbol(
  'Keymap'
)

export const provideKeymap = () => {
  provide(key, createKeymap())
}

export const useKeymap = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useKeymap is not provided')
  else return ret
}
