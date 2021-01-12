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

type WebHIDMessageHandler = (message: DataView) => void

export class WebHID {
  private device: HIDDevice | undefined

  async connect(): Promise<void> {
    this.device = await navigator.hid
      .requestDevice({
        filters: [{ usagePage: 0xff60, usage: 0x61 }],
      })
      .then((ret) => ret[0])
    await this.disconnect()
    await this.device?.open()
  }

  async disconnect(): Promise<void> {
    if (this.isConnected()) {
      await this.device?.close()
    }
  }

  registerMessageHandler(handler: WebHIDMessageHandler): void {
    this.device?.addEventListener(
      'inputreport',
      (event) => {
        handler(event.data)
      },
      { once: true }
    )
  }

  async send(data: DataView): Promise<void> {
    if (this.isConnected()) {
      await this.device?.sendReport(0, data.buffer)
    }
  }

  isConnected(): boolean {
    return !!this.device?.opened
  }

  getName(): string {
    return this.device?.productName ?? ''
  }
}
