import { buildKeycodeFromRaw, buildRawFromKeycode } from '~/utils/keycode'

describe('keycode from raw', () => {
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
})

describe('raw from keycode', () => {
  test('simple unknown(0xFFFF)', () => {
    const raw = 0xffff
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('simple basic(0x4)', () => {
    const raw = 0x0004
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('simple(0x4 + 0x0100)', () => {
    const raw = 0x0104
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('simple(0x4 + 0x1F00)', () => {
    const raw = 0x1f
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('function', () => {
    const raw = 0x2000
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('macro', () => {
    const raw = 0x3016
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('layer tap', () => {
    const raw = 0x4804
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('layer on', () => {
    const raw = 0x5016
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('mod oneshot', () => {
    const raw = 0x551f
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('tapdance', () => {
    const raw = 0x57ff
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('layer taptoggle', () => {
    const raw = 0x5803
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('layer mod', () => {
    const raw = 0x5911
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
  test('mod tap', () => {
    const raw = 0x7204
    expect(buildRawFromKeycode(buildKeycodeFromRaw(raw))).toEqual(raw)
  })
})
