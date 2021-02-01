import { DeviceProtocol } from '@/models/deviceProtocol'
import { DeviceConfig } from '@/models/deviceConfig'
import { HIDCommandID, buildHIDCommand } from '@/utils/hidCommand'
import { convertDeviceToNative } from '@/utils/endian'

export class KeyboardDevice {
  private device: DeviceProtocol
  isConnected: boolean

  constructor(device: DeviceProtocol) {
    this.device = device
    this.isConnected = false
  }

  request = (id: HIDCommandID, buffer?: ArrayBuffer): Promise<DataView> => {
    return new Promise((resolve) => {
      try {
        this.device
          .request(buildHIDCommand(id, buffer).buffer)
          .then((ret) => resolve(ret))
      } catch (e) {
        this.isConnected = false
        throw e
      }
    })
  }

  connect = async () => {
    await this.disconnect()
    await this.device.connect()
    this.isConnected = true
  }

  disconnect = async () => {
    await this.device.disconnect()
    this.isConnected = false
  }

  getViaVersion = () =>
    this.request(HIDCommandID.getProtocolVersion).then((ret) =>
      ret.getUint16(1, false)
    )

  getLayerCount = () =>
    this.request(HIDCommandID.keymapGetLayerCount).then((ret) => ret.getInt8(1))

  getDeviceConfig = async (): Promise<DeviceConfig> => {
    const viaVersion = await this.getViaVersion()
    const layerCount = await this.getLayerCount()
    return { viaVersion, layerCount, name: this.device.getName() } as const
  }

  getLayoutOption = () =>
    this.request(
      HIDCommandID.getKeyboardValue,
      new Uint8Array([0x2]).buffer
    ).then((ret) => ret.getInt16(2, false))

  getKeymapAll = async (
    layerCount: number,
    { rows, cols }: { rows: number; cols: number }
  ) => {
    const totalBytes = layerCount * rows * cols * 2
    const keymap = new Uint8Array(totalBytes)
    let recievedBytes = 0

    while (recievedBytes < totalBytes) {
      const requestSize = Math.min(totalBytes - recievedBytes, 28)
      const requestData = new DataView(new ArrayBuffer(3))
      requestData.setUint16(0, recievedBytes, false)
      requestData.setUint8(2, requestSize)
      const temp = await this.request(
        HIDCommandID.keymapGetBuffer,
        requestData.buffer
      )
      keymap.set(
        new Uint8Array(temp.buffer.slice(4, 4 + requestSize)),
        recievedBytes
      )
      recievedBytes += temp.getInt8(3)
    }
    return convertDeviceToNative(keymap.buffer)
  }
}
