import {
  computed,
  provide,
  reactive,
  InjectionKey,
  inject,
  toRef,
  ref,
} from '@nuxtjs/composition-api'

import { WebHID } from '@/models/webhid'
import { KeyboardDevice } from '@/models/keyboardDevice'
import { DeviceConfig } from '@/models/deviceConfig'
import {
  KeyboardConfig,
  buildKeyboardConfigFromJSON,
} from '@/models/keyboardConfig'
import { DeviceSetting } from '@/models/deviceSetting'

type Config = {
  device: DeviceConfig | undefined
  keyboard: KeyboardConfig | undefined
}

type Setting = {
  device: DeviceSetting | undefined
}

interface ConfigHistoryItem {
  name: string
  src: string
  isPinned: boolean
}

export const createKeyboard = () => {
  const deviceProtocol = new WebHID()

  const device = reactive<KeyboardDevice>(new KeyboardDevice(deviceProtocol))
  const config = reactive<Config>({ device: undefined, keyboard: undefined })
  const setting = reactive<Setting>({ device: undefined })
  const isCommunicating = ref(false)

  const configHistoryJson = window.localStorage.getItem('ConfigHistories')
  const configHistory = ref<ConfigHistoryItem[]>(
    configHistoryJson
      ? JSON.parse(configHistoryJson)
      : [
          {
            name: 'Tartan',
            src:
              'https://gist.githubusercontent.com/hsgw/b9df17b75f12d53e025416af3bd227d8/raw/tartan.json',
            isPinned: false,
          },
        ]
  )

  function saveHistory() {
    window.localStorage.setItem(
      'ConfigHistories',
      JSON.stringify(configHistory.value)
    )
  }

  function addHistory(config: ConfigHistoryItem) {
    configHistory.value.unshift(config)
  }

  const indexedHistory = computed(() =>
    configHistory.value.map((v, index) => ({ ...v, index }))
  )

  function updateHistory(config: { name: string; src: string }) {
    let isPinned = false
    configHistory.value = configHistory.value.filter((v) => {
      if (v.name !== config.name) {
        isPinned = v.isPinned
        return true
      }
      return false
    })
    addHistory({ ...config, isPinned })
    saveHistory()
  }

  function toggleHistoryPin(index: number) {
    configHistory.value[index].isPinned = !configHistory.value[index].isPinned
    saveHistory()
  }

  function removeHistory(index: number) {
    configHistory.value.splice(index, 1)
    saveHistory()
  }

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

    loadDeviceSetting()
  }

  async function disconnectDevice() {
    config.device = undefined
    if (device.isConnected) {
      await device.disconnect()
    }
  }

  async function loadDeviceSetting() {
    if (!device.isConnected || !config.keyboard || !config.device)
      return undefined
    isCommunicating.value = true
    const layoutOption = await device.getLayoutOption()
    const keymap = await device.getKeymapAll(
      config.device.layerCount,
      config.keyboard.matrix
    )
    setting.device = {
      layoutOption,
      keymap,
    }
    isCommunicating.value = false
  }

  async function uploadKeymap(rawKeymap: Uint16Array) {
    if (config.device && config.keyboard) {
      isCommunicating.value = true
      await device.writeKeymapAll(
        config.device.layerCount,
        config.keyboard.matrix,
        rawKeymap
      )
      isCommunicating.value = false
    }
  }

  const isConnected = toRef(device, 'isConnected')
  const hasConfig = computed(() => !!config.keyboard)
  const isValid = computed(
    () => config.keyboard !== undefined && config.device !== undefined
  )
  const keyboadConfig = toRef(config, 'keyboard')
  const deviceConfig = toRef(config, 'device')
  const deviceSetting = toRef(setting, 'device')

  return {
    config,
    indexedHistory,
    updateHistory,
    toggleHistoryPin,
    removeHistory,
    connectDevice,
    loadKeyboardConfig,
    loadDeviceSetting,
    uploadKeymap,
    isCommunicating,
    isConnected,
    hasConfig,
    isValid,
    keyboadConfig,
    deviceConfig,
    deviceSetting,
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
