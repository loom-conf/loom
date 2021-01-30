import { KeycodeList } from '~/utils/keycodeList'

describe('keycode', () => {
  test('simple RAW HID code (4)', () => {
    expect(KeycodeList.FindByRAW(4)?.qmk).toBe('KC_A')
  })
  test('build from simple QMK name (KC_A)', () => {
    expect(KeycodeList.FindByQMK('KC_A')?.raw).toBe(4)
  })
})
