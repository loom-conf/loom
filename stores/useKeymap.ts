import {
  computed,
  inject,
  InjectionKey,
  provide,
  ref,
} from '@nuxtjs/composition-api'
import { KeyboardLayout, buildLayoutFromKLE } from '@/models/keyboardLayout'
import { buildKeymapFromRaw, Keymap } from '@/models/keymap'
import { KeycodeTypes } from '~/utils/keycode'
import { DeviceSetting } from '~/models/deviceSetting'

export const createKeymap = () => {
  const keymap = ref<Keymap>([])
  const layoutAll = ref<KeyboardLayout>([])
  const layoutOption = ref<number>(0)
  const currentLayer = ref<number>(0)

  function setRawLayout(rawLayout: any[] | undefined) {
    if (!rawLayout) layoutAll.value = []
    else layoutAll.value = buildLayoutFromKLE(rawLayout)
  }

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
    layoutAll,
    currentLayer,
    setRawLayout,
    setKeymap,
    setKeycode,
    setLayoutOption,
    getLayoutOption,
    setDeviceSetting,
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
