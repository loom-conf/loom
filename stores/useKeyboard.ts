import {
  computed,
  provide,
  reactive,
  InjectionKey,
  inject,
  ref,
} from '@nuxtjs/composition-api'

import { WebHID } from '@/models/webhid'
import { KeyboardDevice } from '@/models/keyboardDevice'
import { DeviceConfig } from '@/models/deviceConfig'
import {
  KeyboardConfig,
  buildKeyboardConfigFromJSON,
} from '@/models/KeyboardConfig'
import { KeyboardLayout, buildLayoutFromKLE } from '@/models/keyboardLayout'
import { DeviceSetting } from '@/models/deviceSetting'

type Config = {
  device: DeviceConfig | undefined
  keyboard: KeyboardConfig | undefined
}

type Setting = {
  device: DeviceSetting | undefined
}

export const createKeyboard = () => {
  const deviceProtocol = new WebHID()

  const device = reactive<KeyboardDevice>(new KeyboardDevice(deviceProtocol))
  const config = reactive<Config>({ device: undefined, keyboard: undefined })
  const layout = ref<KeyboardLayout>([])
  const setting = reactive<Setting>({ device: undefined })

  async function loadKeyboardConfig(json: any[][], fileSrc: string) {
    await disconnectDevice()
    config.keyboard = undefined
    config.keyboard = { ...buildKeyboardConfigFromJSON(json) }
    config.keyboard.fileSrc = fileSrc
    layout.value = buildLayoutFromKLE(config.keyboard.layouts.keymap)
  }

  async function connectDevice() {
    if (config.keyboard === undefined)
      throw new Error('load keyboard config before connect device')

    config.device = undefined
    await device.connect()
    config.device = await device.getDeviceConfig()

    if (config.device.name !== config.keyboard.name) {
      const str = `config:${config.keyboard.name}, device:${config.device.name}`
      await disconnectDevice()
      throw new Error(`Incorrect combination ${str}`)
    }
    await loadDeviceSetting()
  }

  async function disconnectDevice() {
    config.device = undefined
    if (device.isConnected) {
      await device.disconnect()
    }
  }

  async function loadDeviceSetting() {
    if (!device.isConnected) throw new Error('Device is not connected')
    if (!config.keyboard || !config.device) throw new Error('config is missing')
    const layoutOption = await device.getLayoutOption()
    const keymap = await device.getKeymapAll(
      config.device.layerCount,
      config.keyboard.matrix
    )
    setting.device = {
      layoutOption,
      keymap,
    }
  }

  const isConnected = computed(() => device.isConnected)

  const hasConfig = computed(() => !!config.keyboard)

  const isValid = computed(
    () => config.keyboard !== undefined && config.device !== undefined
  )

  return {
    config,
    layout,
    setting,
    connectDevice,
    loadDeviceSetting,
    loadKeyboardConfig,
    isConnected,
    hasConfig,
    isValid,
  }
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
