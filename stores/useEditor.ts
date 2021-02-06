import { InjectionKey, provide, inject } from '@nuxtjs/composition-api'

export function createEditor() {
  return {}
}

/* provide/inject */
export const key: InjectionKey<ReturnType<typeof createEditor>> = Symbol(
  'Editor'
)

export const provideEditor = () => {
  provide(key, createEditor())
}

export const useEditor = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useEditor is not provided')
  else return ret
}
