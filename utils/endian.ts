// Device should be big endian
export function convertDeviceToNative(array: ArrayBuffer): Uint16Array {
  const view = new DataView(array)
  const dist = new Uint16Array(view.byteLength / 2)
  for (let i = 0; i < view.byteLength; i += 2) {
    dist[i / 2] = view.getInt16(i, false)
  }
  return dist
}

export function convertNativeToDevice(array: Uint16Array): ArrayBuffer {
  const view = new DataView(new ArrayBuffer(array.length * 2))
  for (let i = 0; i < array.length; i++) {
    view.setUint16(i * 2, array[i], false)
  }
  return view.buffer
}
