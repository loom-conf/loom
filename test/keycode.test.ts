import { buildKeycodeFromRaw } from '~/utils/keycode'

describe('keycode', () => {
  test('simple (4)', () => {
    expect(buildKeycodeFromRaw(4)).toEqual({
      kind: 'BASIC',
      qmk: 'KC_A',
      raw: 4,
      mods: [],
      base: expect.anything(),
    })
  })
  test('with mod (S(KC_A))', () => {
    expect(buildKeycodeFromRaw(4 + 0x0200)).toEqual({
      kind: 'BASIC',
      qmk: 'LSFT(KC_A)',
      raw: 4 + 0x0200,
      mods: ['LSFT'],
      base: expect.anything(),
    })
  })
  test('with mod (RGUI(RCTL(KC_A)))', () => {
    expect(buildKeycodeFromRaw(4 + 0x1900)).toEqual({
      kind: 'BASIC',
      qmk: 'RGUI(RCTL(KC_A))',
      raw: 4 + 0x1900,
      mods: ['RCTL', 'RGUI'],
      base: expect.anything(),
    })
  })
  // test('Macro(0)', () => {
  //   expect(buildKeycodeFromRaw(24338)).toEqual({
  //     kind: 'MACRO',
  //     qmk: 'M(0)',
  //     raw: 0x5f12,
  //     macro: 0,
  //   })
  // })
  // test('MT(MOD_SHIFT, KC_ENT) 0x5CD9', () => {
  //   expect(buildKeycodeFromRaw(23769)).toEqual({
  //     kind: 'MOD_TAP',
  //     qmk: 'MT(MOD_SHIFT, KC_ENT)',
  //     raw: 0x5cd9,
  //     macro: 0,
  //   })
  // })
})
