import { InjectionKey, provide, inject, ref } from '@nuxtjs/composition-api'

interface DialogState {
  header: string
  message: string
  hasCancel: boolean
}

export function createDialog() {
  const isOpen = ref(false)
  const state = ref<DialogState>({
    header: 'header',
    message: 'message',
    hasCancel: false,
  })
  let dialogResolve: (flag: boolean) => void

  const openDialog = (dialogState: DialogState) => {
    state.value = dialogState
    isOpen.value = true
    return new Promise((resolve) => {
      dialogResolve = resolve
    })
  }

  const closeDialog = (flag: boolean) => {
    isOpen.value = false
    if (dialogResolve) dialogResolve(flag)
  }

  return { isOpen, state, openDialog, closeDialog }
}

/* provide/inject */
export const key: InjectionKey<ReturnType<typeof createDialog>> = Symbol(
  'Dialog'
)

export const provideDialog = () => {
  provide(key, createDialog())
}

export const useDialog = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useDialog is not provided')
  else return ret
}
