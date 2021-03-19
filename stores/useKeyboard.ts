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
import { ConfigHistory } from '@/models/configHistory'
import { useDialog } from '@/stores/useDialog'

type Config = {
  device: DeviceConfig | undefined
  keyboard: KeyboardConfig | undefined
}

type Setting = {
  device: DeviceSetting | undefined
}

export const createKeyboard = () => {
  const { openDialog } = useDialog()

  const deviceProtocol = new WebHID()

  const device = reactive<KeyboardDevice>(new KeyboardDevice(deviceProtocol))
  const config = reactive<Config>({ device: undefined, keyboard: undefined })
  const setting = reactive<Setting>({ device: undefined })
  const isCommunicating = ref(false)

  const configHistory = reactive<ConfigHistory>(new ConfigHistory())

  const indexedHistory = computed(() =>
    configHistory.items.map((v, index) => ({ ...v, index }))
  )

  function updateHistory(history: { name: string; src: string }) {
    configHistory.update(history)
  }

  function toggleHistoryPin(index: number) {
    configHistory.togglePin(index)
  }

  function removeHistory(index: number) {
    configHistory.remove(index)
  }

  async function loadKeyboardConfig(json: any[][], url?: string) {
    if (config.keyboard && isConnected.value) {
      const res = await openDialog({
        header: 'Load config',
        message: `The config has already been loaded. (${config.keyboard.name})\nAll changes not yet uploaded to the keyboard will be discarded.\n\nAre you sure you want to load?`,
        hasCancel: true,
        isError: false,
      })
      if (!res) return
    }
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
          const history = configHistory.items.find(
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
    const res = await openDialog({
      header: 'Disconnect device',
      message:
        'All changes not yet uploaded to the keyboard will be discarded.\n\nAre you sure you want to disconnect?',
      hasCancel: true,
      isError: false,
    })
    if (!res) return
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
