export namespace QMK {
  export enum CommandID {
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

  export interface Command {
    id: CommandID
    data?: number[]
  }

  export function makeCommand(command: Command): DataView {
    const dataView = new DataView(new ArrayBuffer(32))
    dataView.setUint8(0, command.id)
    if (command.data) {
      for (const [i, data] of command.data.entries()) {
        dataView.setUint8(1 + i, data)
      }
    }
    return dataView
  }
}
