import { LayoutOption } from '@/models/layoutOption'

describe('LayoutOption', () => {
  test('parse from config (undefined)', () => {
    const layoutOption = new LayoutOption()
    layoutOption.setLabels(undefined)
    expect(layoutOption.items).toBeUndefined()
  })

  test('parse from config (simple)', () => {
    const layoutOption = new LayoutOption()
    layoutOption.setLabels(['test'])
    expect(layoutOption.items).toEqual(
      expect.arrayContaining([{ label: 'test', current: 0 }])
    )
  })

  test('parse from config (complex)', () => {
    const layoutOption = new LayoutOption()
    layoutOption.setLabels(['test', ['test2Label', 'test2', 'test3']])
    expect(layoutOption.items).toEqual(
      expect.arrayContaining([
        { label: 'test', current: 0 },
        { label: 'test2Label', options: ['test2', 'test3'], current: 0 },
      ])
    )
  })

  test('set raw setting', () => {
    const layoutOption = new LayoutOption()
    layoutOption.setLabels(['test'])
    layoutOption.setRawSetting(1)
    expect(layoutOption.items).toEqual(
      expect.arrayContaining([{ label: 'test', current: 1 }])
    )
  })

  test('set raw setting (complex)', () => {
    const layoutOption = new LayoutOption()
    layoutOption.setLabels(['test', ['test2Label', 'test2', 'test3', 'test4']])
    layoutOption.setRawSetting(6)
    expect(layoutOption.items).toEqual(
      expect.arrayContaining([
        { label: 'test', current: 1 },
        {
          label: 'test2Label',
          options: ['test2', 'test3', 'test4'],
          current: 2,
        },
      ])
    )
  })

  test('get raw setting (items is undefined)', () => {
    const layoutOption = new LayoutOption()
    layoutOption.setLabels(undefined)
    expect(layoutOption.getRawSetting()).toBe(0)
  })

  test('get raw setting', () => {
    const layoutOption = new LayoutOption()
    layoutOption.setLabels(['test'])
    layoutOption.setRawSetting(1)
    expect(layoutOption.getRawSetting()).toBe(1)
  })

  test('get raw setting (complex)', () => {
    const layoutOption = new LayoutOption()
    layoutOption.setLabels(['test', ['test2Label', 'test2', 'test3', 'test4']])
    layoutOption.setRawSetting(6)
    expect(layoutOption.getRawSetting()).toBe(6)
  })
})
