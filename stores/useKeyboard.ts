import {
  computed,
  provide,
  reactive,
  InjectionKey,
  inject,
  toRef,
  ref,
} from '@nuxtjs/composition-api'

import axios from 'axios'

import { WebHID } from '@/models/webhid'
import { KeyboardDevice } from '@/models/keyboardDevice'
import { DeviceConfig } from '@/models/deviceConfig'
import {
  KeyboardConfig,
  buildKeyboardConfigFromJSON,
} from '@/models/keyboardConfig'
import { DeviceSetting } from '@/models/deviceSetting'
import { useDialog } from '@/stores/useDialog'

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
  const { openDialog } = useDialog()

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
      if (v.name === config.name) {
        isPinned = v.isPinned
        return false
      }
      return true
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

  async function loadKeyboardConfig(json: any[][], url?: string) {
    let loadedConfig
    try {
      loadedConfig = buildKeyboardConfigFromJSON(json)
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e)
      await openDialog({
        header: 'Config file error',
        message: e.message,
        hasCancel: false,
        isError: true,
      })
      return
    }
    if (
      (config.device && loadedConfig.name === config.device.name) ||
      !config.device
    ) {
      config.keyboard = {
        ...loadedConfig,
        fileSrc: url ?? 'local',
      }
      updateHistory({
        name: config.keyboard?.name ?? '',
        src: config.keyboard?.fileSrc ?? '',
      })
      await loadDeviceSetting()
    } else {
      await openDialog({
        header: 'Wrong config error',
        message: `loaded wrong config: ${loadedConfig.name}`,
        hasCancel: false,
        isError: true,
      })
    }
  }

  async function fetchKeybordConfig(url: string) {
    let res
    try {
      res = await axios.get(url)
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e)
      await openDialog({
        header: 'Fetch config error',
        message: e.toString(),
        hasCancel: false,
        isError: true,
      })
      return
    }
    await loadKeyboardConfig(res.data, url)
  }

  async function connectDevice() {
    config.device = undefined
    setting.device = undefined

    try {
      await device.connect()
      const loadedDeviceConfig = await device.getDeviceConfig()

      if (
        (config.keyboard && loadedDeviceConfig.name === config.keyboard.name) ||
        !config.keyboard
      ) {
        config.device = loadedDeviceConfig
        if (!config.keyboard) {
          const history = configHistory.value.find(
            (v) => v.name === config.device?.name
          )
          if (history) {
            const autoload = await openDialog({
              header: `Autoload config?`,
              message: `The config file for ${history.name} is found in the history.\nContinue to load automatically? `,
              hasCancel: true,
            })
            if (autoload) await fetchKeybordConfig(history.src)
          }
        }
        await loadDeviceSetting()
      } else {
        await device.disconnect()
        await openDialog({
          header: 'Wrong device error',
          message: `connected wrong device: ${loadedDeviceConfig.name}`,
          hasCancel: false,
          isError: true,
        })
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      await openDialog({
        header: 'Connect device error',
        message: e.toString(),
        hasCancel: false,
        isError: true,
      })
    }
  }

  async function disconnectDevice() {
    if (device.isConnected) {
      try {
        await device.disconnect()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        await openDialog({
          header: 'Disconnect device error',
          message: e.toString(),
          hasCancel: false,
          isError: true,
        })
      }
    }
    config.device = undefined
    setting.device = undefined
  }

  async function loadDeviceSetting() {
    if (!device.isConnected || !config.keyboard || !config.device) return
    isCommunicating.value = true
    try {
      const layoutOption = await device.getLayoutOption()
      const keymap = await device.getKeymapAll(
        config.device.layerCount,
        config.keyboard.matrix
      )
      setting.device = {
        layoutOption,
        keymap,
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      await openDialog({
        header: 'Load device setting error',
        message: e.toString(),
        hasCancel: false,
        isError: true,
      })
    }
    isCommunicating.value = false
  }

  async function uploadKeymap(rawKeymap: Uint16Array) {
    if (config.device && config.keyboard) {
      isCommunicating.value = true
      try {
        await device.writeKeymapAll(
          config.device.layerCount,
          config.keyboard.matrix,
          rawKeymap
        )
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        await openDialog({
          header: 'Upload keymap error',
          message: e.toString(),
          hasCancel: false,
          isError: true,
        })
      }
      isCommunicating.value = false
    }
  }

  const isConnected = toRef(device, 'isConnected')
  const keyboadConfig = toRef(config, 'keyboard')
  const deviceConfig = toRef(config, 'device')
  const deviceSetting = toRef(setting, 'device')

  return {
    indexedHistory,
    updateHistory,
    toggleHistoryPin,
    removeHistory,
    connectDevice,
    disconnectDevice,
    loadKeyboardConfig,
    fetchKeybordConfig,
    loadDeviceSetting,
    uploadKeymap,
    isCommunicating,
    isConnected,
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
