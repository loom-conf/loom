export interface LayoutOptionItem {
  label: string
  options?: Array<string>
  value: number
}

export class LayoutOption {
  public items: Array<LayoutOptionItem> | undefined

  constructor() {
    this.items = undefined
  }

  setLabels(labels: Array<string[] | string> | undefined) {
    if (!labels) {
      this.items = undefined
    } else {
      this.items = labels.map(
        (v): LayoutOptionItem => {
          if (typeof v === 'string')
            return {
              label: v,
              value: 0,
            }
          else
            return {
              label: v[0],
              options: v.slice(1),
              value: 0,
            }
        }
      )
    }
  }

  setRawSetting(layoutOption: number) {
    if (!this.items) return

    let bitPos = 0
    this.items
      .slice(0)
      .reverse()
      .forEach((item) => {
        const bitWidth = this.calcBitWidth(item)
        item.value = (layoutOption >> bitPos) & this.makeBitMask(bitWidth)
        bitPos += bitWidth
      })
  }

  getRawSetting(): number {
    if (!this.items) return 0

    return this.items.reduce((layoutOption, item) => {
      const bitWidth = this.calcBitWidth(item)
      return (
        (layoutOption << bitWidth) + (item.value & this.makeBitMask(bitWidth))
      )
    }, 0)
  }

  private calcBitWidth(item: LayoutOptionItem) {
    return item.options ? Math.ceil(Math.sqrt(item.options.length)) : 1
  }

  private makeBitMask(bitWidth: number) {
    let bitMask = 0
    for (let i = 0; i < bitWidth; i++) {
      bitMask = (bitMask << 1) + 1
    }
    return bitMask
  }
}
