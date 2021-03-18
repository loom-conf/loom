import { DeviceProtocol, DeviceMessageHandler } from '~/models/deviceProtocol'

export declare interface HIDDevice {
  opened: boolean
  vendorId: number
  productId: number
  productName: string
  collections: any[]
  open(): Promise<undefined>
  close(): Promise<undefined>
  addEventListener(
    type: string,
    listener: (event: any) => void,
    option?: boolean | AddEventListenerOptions
  ): void
  sendReport(reportId: number, data: ArrayBuffer): Promise<undefined>
}

export declare const navigator: Navigator & {
  hid: {
    requestDevice(option: any): Promise<HIDDevice[]>
  }
}

export class WebHID implements DeviceProtocol {
  private device: HIDDevice | undefined

  async connect(): Promise<boolean> {
    try {
      this.device = await navigator.hid
        .requestDevice({
          filters: [{ usagePage: 0xff60, usage: 0x61 }],
        })
        .then((ret) => ret[0])
    } catch {
      throw new Error("This browser doesn't support webhid feature")
    }

    if (this.device) {
      // avoid reopen error
      await this.disconnect()
      await this.device.open()
      return true
    } else {
      // device is not selected
      return false
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected()) {
      await this.device?.close()
    }
  }

  registerMessageHandler(handler: DeviceMessageHandler): void {
    this.device?.addEventListener(
      'inputreport',
      (event) => {
        handler(event.data)
      },
      { once: true }
    )
  }

  async send(buffer: ArrayBuffer): Promise<void> {
    if (this.isConnected()) {
      await this.device?.sendReport(0, buffer)
    }
  }

  request(arrayBuffer: ArrayBuffer): Promise<DataView> {
    return new Promise((resolve) => {
      this.registerMessageHandler((recieved) => {
        resolve(recieved)
      })
      this.send(arrayBuffer).catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e)
      })
    })
  }

  isConnected(): boolean {
    return !!this.device?.opened
  }

  getName(): string {
    return this.device?.productName ?? ''
  }
}
