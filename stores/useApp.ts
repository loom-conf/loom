import { InjectionKey, provide, inject, ref } from '@nuxtjs/composition-api'

export type BottomTabState = 'Device' | 'keymap' | 'Layout'

export function createApp() {
  const bottomTabState = ref<BottomTabState>('Device')
  const setBottomTab = (value: BottomTabState) => {
    bottomTabState.value = value
  }
  return { setBottomTab, bottomTabState }
}

/* provide/inject */
export const key: InjectionKey<ReturnType<typeof createApp>> = Symbol('App')

export const provideApp = () => {
  provide(key, createApp())
}

export const useApp = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useApp is not provided')
  else return ret
}
