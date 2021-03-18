export type DeviceMessageHandler = (message: DataView) => void

export interface DeviceProtocol {
  connect(): Promise<boolean>
  disconnect(): Promise<void>
  registerMessageHandler(handler: DeviceMessageHandler): void
  request(buffer: ArrayBuffer): Promise<DataView>
  isConnected(): boolean
  getName(): string
}
