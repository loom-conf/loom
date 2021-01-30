export type DeviceMessageHandler = (message: DataView) => void

export interface DeviceProtocol {
  connect(): Promise<void>
  disconnect(): Promise<void>
  registerMessageHandler(handler: DeviceMessageHandler): void
  request(buffer: ArrayBuffer): Promise<DataView>
  isConnected(): boolean
  getName(): string
}
