import { reactive, toRefs } from '@nuxtjs/composition-api'
import { WebHID } from '@/utils/webhid'
import { QMK } from '~/utils/qmk'

interface KeyCode {
  hid: number
  qmk: string
}

interface KeyboardState {
  isConnected: boolean
  name: string
  viaVersion: number
  layoutOption: number
  keycodes: KeyCode[]
  layerCount: number
}

export default function useKeyboardHID() {
  const protocol = new WebHID()

  const state = reactive<KeyboardState>({
    isConnected: false,
    name: '',
    viaVersion: 0,
    layoutOption: 0,
    keycodes: [],
    layerCount: 0,
  })

  const requestData = (command: QMK.Command): Promise<DataView> =>
    new Promise((resolve) => {
      protocol.registerMessageHandler((recieved) => {
        resolve(recieved)
      })
      protocol.send(QMK.makeCommand(command))
    })

  const connect = async () => {
    if (state.isConnected) disconnect()
    try {
      await protocol.connect()

      state.viaVersion = await requestData({
        id: QMK.CommandID.getProtocolVersion,
      }).then((ret) => ret.getUint16(1, false))

      state.layoutOption = await requestData({
        id: QMK.CommandID.getKeyboardValue,
        data: [0x2],
      }).then((ret) => ret.getInt16(2, false))

      state.layerCount = await requestData({
        id: QMK.CommandID.keymapGetLayerCount,
      }).then((ret) => ret.getInt8(1))
      state.name = protocol.getName()
      state.isConnected = true
    } catch (err) {
      state.isConnected = false
      console.error(err)
    }
    console.info(
      `connected
      name:${state.name}
      via version:${state.viaVersion}
      layoutOption:${state.layoutOption}
      layerCount:${state.layerCount}`
    )
  }

  const disconnect = async () => {
    await protocol.disconnect()
    state.isConnected = false
    state.name = ''
    state.viaVersion = 0
    state.layoutOption = 0
    state.keycodes = []
  }

  return { ...toRefs(state), connect, disconnect }
}
