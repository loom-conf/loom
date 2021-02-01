import { convertDeviceToNative, convertNativeToDevice } from '@/utils/endian'

describe('endian', () => {
  test('device to native', () => {
    const data = new Uint8Array([0, 1, 0, 2, 0, 3, 0, 4])
    expect(convertDeviceToNative(data.buffer)).toEqual(
      new Uint16Array([1, 2, 3, 4])
    )
  })
  test('device to native', () => {
    const data = new Uint16Array([1, 2, 3, 4])
    expect(convertNativeToDevice(data)).toEqual(
      new Uint8Array([0, 1, 0, 2, 0, 3, 0, 4]).buffer
    )
  })
})
