import {
  computed,
  provide,
  reactive,
  InjectionKey,
  inject,
} from '@nuxtjs/composition-api'

import { WebHID } from '@/models/webhid'
import { KeyboardDevice } from '@/models/keyboardDevice'
import { DeviceConfig } from '@/models/deviceConfig'
import { KeyboardConfig, KeyboardConfigBuilder } from '@/models/KeyboardConfig'

type Config = {
  device: DeviceConfig | undefined
  keyboard: KeyboardConfig | undefined
}

export const createKeyboard = () => {
  const deviceProtocol = new WebHID()

  const device = reactive<KeyboardDevice>(new KeyboardDevice(deviceProtocol))
  const config = reactive<Config>({ device: undefined, keyboard: undefined })

  const loadConfig = (data: any[], fileSrc: string) => {
    config.keyboard = { ...KeyboardConfigBuilder.BuildFromJSON(data) }
    config.keyboard.fileSrc = fileSrc
  }

  const connect = async () => {
    await device.connect()
  }

  const isConnected = computed(() => device.isConnected)

  return { config, connect, loadConfig, isConnected }
}

/* provide/inject */
export const key: InjectionKey<ReturnType<typeof createKeyboard>> = Symbol(
  'KeyboardDevice'
)

export const provideKeyboard = () => {
  provide(key, createKeyboard())
}

export const useKeyboard = () => inject(key)
