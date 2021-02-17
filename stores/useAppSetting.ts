import {
  InjectionKey,
  provide,
  inject,
  reactive,
} from '@nuxtjs/composition-api'

interface ViewerOption {
  hideUnselectedLayout: boolean
}

export function createAppSetting() {
  const viewerOption = reactive<ViewerOption>({ hideUnselectedLayout: true })
  return { viewerOption }
}

/* provide/inject */
export const key: InjectionKey<ReturnType<typeof createAppSetting>> = Symbol(
  'AppSetting'
)

export const provideAppSetting = () => {
  provide(key, createAppSetting())
}

export const useAppSetting = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useAppSetting is not provided')
  else return ret
}
