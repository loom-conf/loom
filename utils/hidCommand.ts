export enum HIDCommandID {
  getProtocolVersion = 0x01,
  getKeyboardValue,
  setKeyboardValue,
  keymapGetKeycode,
  keymapSetKeycode,
  keymapReset,
  lightningSetValue,
  lightningGetValue,
  lightningSave,
  eepromReset,
  jumpBootloader,
  macroGetCount,
  macroGetBufferSize,
  macroGetBuffer,
  macroSetBuffer,
  macroReset,
  keymapGetLayerCount,
  keymapGetBuffer,
  keymapSetBuffer,
  unhandled = 0xff,
}

export class HIDCommand {
  buffer: ArrayBuffer
  constructor(id: HIDCommandID, data?: ArrayBuffer) {
    this.buffer = new ArrayBuffer(32)
    const uint8Array = new Uint8Array(this.buffer)
    uint8Array[0] = id
    if (data) {
      uint8Array.set(new Uint8Array(data), 1)
    }
  }
}
