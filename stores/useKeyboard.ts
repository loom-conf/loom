import {
  computed,
  provide,
  reactive,
  InjectionKey,
  inject,
  shallowRef,
} from '@nuxtjs/composition-api'

import { WebHID } from '@/models/webhid'
import { KeyboardDevice } from '@/models/keyboardDevice'
import { DeviceConfig } from '@/models/deviceConfig'
import {
  KeyboardConfig,
  buildKeyboardConfigFromJSON,
} from '@/models/KeyboardConfig'
import { KeyboardLayout, buildLayoutFromKLE } from '@/models/keyboardLayout'

type Config = {
  device: DeviceConfig | undefined
  keyboard: KeyboardConfig | undefined
}

export const createKeyboard = () => {
  const deviceProtocol = new WebHID()

  const device = reactive<KeyboardDevice>(new KeyboardDevice(deviceProtocol))
  const config = reactive<Config>({ device: undefined, keyboard: undefined })
  const layout = shallowRef<KeyboardLayout>([])

  function loadConfig(json: any[][], fileSrc: string) {
    config.keyboard = undefined
    config.keyboard = { ...buildKeyboardConfigFromJSON(json) }
    config.keyboard.fileSrc = fileSrc
    layout.value = buildLayoutFromKLE(config.keyboard.layouts.keymap)
  }

  async function connect() {
    await device.connect()
  }

  const isConnected = computed(() => device.isConnected)

  const hasConfig = computed(() => !!config.keyboard)

  return { config, layout, connect, loadConfig, isConnected, hasConfig }
}

/* provide/inject */
export const key: InjectionKey<ReturnType<typeof createKeyboard>> = Symbol(
  'Keyboard'
)

export const provideKeyboard = () => {
  provide(key, createKeyboard())
}

export const useKeyboard = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useKeyboard is not provided')
  else return ret
}
