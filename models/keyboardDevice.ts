import { DeviceProtocol } from '@/models/deviceProtocol'
import { DeviceConfig } from '@/models/deviceConfig'
import { HIDCommandID, buildHIDCommand } from '@/utils/hidCommand'
import { convertDeviceToNative, convertNativeToDevice } from '@/utils/endian'

export class KeyboardDevice {
  private device: DeviceProtocol
  isConnected: boolean

  constructor(device: DeviceProtocol) {
    this.device = device
    this.isConnected = false
  }

  request(id: HIDCommandID, buffer?: ArrayBuffer): Promise<DataView> {
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

  async connect() {
    await this.disconnect()
    await this.device.connect()
    this.isConnected = true
  }

  async disconnect() {
    await this.device.disconnect()
    this.isConnected = false
  }

  getViaVersion() {
    return this.request(HIDCommandID.getProtocolVersion).then((ret) =>
      ret.getUint16(1, false)
    )
  }

  getLayerCount() {
    return this.request(HIDCommandID.keymapGetLayerCount).then((ret) =>
      ret.getInt8(1)
    )
  }

  async getDeviceConfig(): Promise<DeviceConfig> {
    const viaVersion = await this.getViaVersion()
    const layerCount = await this.getLayerCount()
    return { viaVersion, layerCount, name: this.device.getName() } as const
  }

  getLayoutOption() {
    return this.request(
      HIDCommandID.getKeyboardValue,
      new Uint8Array([0x2]).buffer
    ).then((ret) => ret.getUint32(2, false))
  }

  async getKeymapAll(
    layerCount: number,
    { rows, cols }: { rows: number; cols: number }
  ) {
    const totalBytes = layerCount * rows * cols * 2
    const keymap = new Uint8Array(totalBytes)
    let recievedBytes = 0

    while (recievedBytes < totalBytes) {
      const requestBytes = Math.min(totalBytes - recievedBytes, 28)
      const requestData = new DataView(new ArrayBuffer(3))
      requestData.setUint16(0, recievedBytes, false)
      requestData.setUint8(2, requestBytes)
      const temp = await this.request(
        HIDCommandID.keymapGetBuffer,
        requestData.buffer
      )
      keymap.set(
        new Uint8Array(temp.buffer.slice(4, 4 + requestBytes)),
        recievedBytes
      )
      recievedBytes += temp.getInt8(3)
    }
    return convertDeviceToNative(keymap.buffer)
  }

  async writeKeymapAll(
    layerCount: number,
    { rows, cols }: { rows: number; cols: number },
    keymap: Uint16Array
  ) {
    const totalBytes = layerCount * rows * cols * 2

    if (keymap.byteLength !== totalBytes)
      throw new Error('buffer length is not match with keyboard key count.')

    let sendedBytes = 0
    const buffer = new Uint8Array(convertNativeToDevice(keymap))

    while (sendedBytes < totalBytes) {
      const requestBytes = Math.min(totalBytes - sendedBytes, 28)
      const requestArray = new Uint8Array(requestBytes + 3)
      requestArray.set(buffer.slice(sendedBytes, sendedBytes + requestBytes), 3)
      const requestData = new DataView(requestArray.buffer)
      requestData.setUint16(0, sendedBytes, false)
      requestData.setUint8(2, requestBytes)
      const ret = await this.request(
        HIDCommandID.keymapSetBuffer,
        requestData.buffer
      )
      sendedBytes += ret.getInt8(3)
    }
  }
}
