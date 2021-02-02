import {
  computed,
  inject,
  InjectionKey,
  provide,
  ref,
} from '@nuxtjs/composition-api'
import { buildKeymapFromRaw, Keymap } from '@/models/keymap'
import { KeycodeTypes } from '~/utils/keycode'
import { DeviceSetting } from '~/models/deviceSetting'

export const createEditor = () => {
  const keymap = ref<Keymap>([])
  const layoutOption = ref<number>(0)
  const currentLayer = ref<number>(0)

  const setKeymap = (array: Uint16Array | undefined) => {
    keymap.value = array ? buildKeymapFromRaw(array) : []
  }

  const setKeycode = (index: number, keycode: KeycodeTypes) => {
    keymap.value[index] = keycode
  }

  const setLayoutOption = (value: number | undefined) => {
    layoutOption.value = value ?? 0
  }

  const getLayoutOption = computed(() => layoutOption.value)

  const setDeviceSetting = (setting: DeviceSetting | undefined) => {
    setKeymap(setting?.keymap)
    setLayoutOption(setting?.layoutOption)
  }

  return {
    keymap,
    currentLayer,
    setKeymap,
    setKeycode,
    setLayoutOption,
    getLayoutOption,
    setDeviceSetting,
  }
}

/* provide/inject */
export const key: InjectionKey<ReturnType<typeof createEditor>> = Symbol(
  'Editor'
)

export const provideEditor = () => {
  provide(key, createEditor())
}

export const useEditor = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useEditor is not provided')
  else return ret
}
