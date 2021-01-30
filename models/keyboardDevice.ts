import { DeviceProtocol } from '@/models/deviceProtocol'
import { DeviceConfig } from '@/models/deviceConfig'
import { HIDCommandID, HIDCommand } from '@/utils/hidCommand'

export class KeyboardDevice {
  private device: DeviceProtocol
  isConnected: boolean

  constructor(device: DeviceProtocol) {
    this.device = device
    this.isConnected = false
  }

  request = (id: HIDCommandID, buffer?: ArrayBuffer): Promise<DataView> => {
    if (!this.isConnected) throw new Error("Keyboard Device isn't connected")
    return new Promise((resolve) => {
      this.device
        ?.request(new HIDCommand(id, buffer).buffer)
        .then((ret) => resolve(ret))
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

  getLayoutOption = () =>
    this.request(
      HIDCommandID.getKeyboardValue,
      new Uint8Array([0x2]).buffer
    ).then((ret) => ret.getInt16(2, false))

  getLayerCount = () =>
    this.request(HIDCommandID.keymapGetLayerCount).then((ret) => ret.getInt8(1))

  getDeviceConfig = async (): Promise<DeviceConfig> => {
    const viaVersion = await this.getViaVersion()
    const layerCount = await this.getLayerCount()
    return { viaVersion, layerCount, name: this.device.getName() } as const
  }
}
