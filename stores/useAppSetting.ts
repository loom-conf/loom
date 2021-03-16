import { InjectionKey, provide, inject, ref } from '@nuxtjs/composition-api'

interface ViewerOption {
  hideUnselectedLayout: boolean
}

export function createAppSetting() {
  const optionJson = window.localStorage.getItem('ViewerOption')

  const viewerOption = ref<ViewerOption>(
    optionJson ? JSON.parse(optionJson) : { hideUnselectedLayout: true }
  )

  const setViewerOption = (option: ViewerOption) => {
    viewerOption.value = option
    window.localStorage.setItem(
      'ViewerOption',
      JSON.stringify(viewerOption.value)
    )
  }

  return { viewerOption, setViewerOption }
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
