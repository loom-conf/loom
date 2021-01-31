import { KeycodeBuilder } from '~/utils/keycode'

describe('keycode', () => {
  test('simple (4)', () => {
    const keycode = KeycodeBuilder.BuildFromRAW(4)
    expect(keycode).toEqual({
      type: 'BASIC',
      qmk: 'KC_A',
      raw: 4,
      mods: [],
      base: expect.anything(),
    })
  })
  test('with mod (S(KC_A))', () => {
    expect(KeycodeBuilder.BuildFromRAW(4 + 0x0200)).toEqual({
      type: 'BASIC',
      qmk: 'LSFT(KC_A)',
      raw: 4 + 0x0200,
      mods: ['LSFT'],
      base: expect.anything(),
    })
  })
  test('with mod (RGUI(RCTL(KC_A)))', () => {
    expect(KeycodeBuilder.BuildFromRAW(4 + 0x1900)).toEqual({
      type: 'BASIC',
      qmk: 'RGUI(RCTL(KC_A))',
      raw: 4 + 0x1900,
      mods: ['RCTL', 'RGUI'],
      base: expect.anything(),
    })
  })
})
