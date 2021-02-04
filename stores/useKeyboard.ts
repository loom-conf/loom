import {
  computed,
  provide,
  reactive,
  InjectionKey,
  inject,
  toRef,
} from '@nuxtjs/composition-api'

import { WebHID } from '@/models/webhid'
import { KeyboardDevice } from '@/models/keyboardDevice'
import { DeviceConfig } from '@/models/deviceConfig'
import {
  KeyboardConfig,
  buildKeyboardConfigFromJSON,
} from '@/models/KeyboardConfig'
import { DeviceSetting } from '@/models/deviceSetting'

type Config = {
  device: DeviceConfig | undefined
  keyboard: KeyboardConfig | undefined
}

export const createKeyboard = () => {
  const deviceProtocol = new WebHID()

  const device = reactive<KeyboardDevice>(new KeyboardDevice(deviceProtocol))
  const config = reactive<Config>({ device: undefined, keyboard: undefined })

  async function loadKeyboardConfig(json: any[][], fileSrc: string) {
    await disconnectDevice()
    config.keyboard = { ...buildKeyboardConfigFromJSON(json), fileSrc }
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
  }

  async function disconnectDevice() {
    config.device = undefined
    if (device.isConnected) {
      await device.disconnect()
    }
  }

  async function getDeviceSetting(): Promise<DeviceSetting | undefined> {
    if (!device.isConnected || !config.keyboard || !config.device)
      return undefined
    const layoutOption = await device.getLayoutOption()
    const keymap = await device.getKeymapAll(
      config.device.layerCount,
      config.keyboard.matrix
    )
    return {
      layoutOption,
      keymap,
    }
  }

  const isConnected = toRef(device, 'isConnected')

  const hasConfig = computed(() => !!config.keyboard)

  const isValid = computed(
    () => config.keyboard !== undefined && config.device !== undefined
  )

  const keyboadConfig = toRef(config, 'keyboard')

  const deviceConfig = toRef(config, 'device')

  return {
    config,
    connectDevice,
    loadKeyboardConfig,
    getDeviceSetting,
    isConnected,
    hasConfig,
    isValid,
    keyboadConfig,
    deviceConfig,
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
