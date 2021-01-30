import {
  provide,
  reactive,
  InjectionKey,
  inject,
} from '@nuxtjs/composition-api'
import axios from 'axios'

import { KeyboardConfig, KeyboardConfigBuilder } from '@/models/KeyboardConfig'
import { DeviceConfig } from '~/models/deviceConfig'

type State = {
  config: KeyboardConfig | undefined
  deviceConfig: DeviceConfig | undefined
  jsonFileLocation: string | undefined
}

export const createKeyboardConfig = () => {
  const state = reactive<State>({
    config: undefined,
    deviceConfig: undefined,
    jsonFileLocation: undefined,
  })

  const loadJSON = async (jsonFileLocation: string) => {
    const url = new URL(jsonFileLocation)
    const res = await axios.get(url.toString())
    state.config = KeyboardConfigBuilder.BuildFromJSON(res.data)
    state.jsonFileLocation = jsonFileLocation
  }

  const setDeviceConfig = (deviceConfig: DeviceConfig) => {
    state.deviceConfig = deviceConfig
  }

  return { state, loadJSON, setDeviceConfig }
}

export const key: InjectionKey<
  ReturnType<typeof createKeyboardConfig>
> = Symbol('KeyboardConfig')

export const provideKeyboardConfig = () => {
  provide(key, createKeyboardConfig())
}

export const injectKeyboardConfig = () => inject(key)
