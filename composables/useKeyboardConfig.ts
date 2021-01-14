import { reactive, toRefs } from '@nuxtjs/composition-api'
import axios from 'axios'

import { KeyboardJSON, Convert as ConvertJSON } from '@/utils/keyboardJSON'
import { LayoutKey, KeyboardLayout } from '@/utils/keyboardLayout'

type KeyboardConfig = KeyboardJSON | undefined

interface KeyboardConfigState {
  jsonURL: string
  layout: LayoutKey[]
  config: KeyboardConfig
}

export default function useKeyboardConfig() {
  const state = reactive<KeyboardConfigState>({
    jsonURL: '',
    layout: [],
    config: undefined,
  })

  const loadJSONFromURL = async (stringURL: string): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const url = new URL(stringURL)
    const res = await axios.get(stringURL)
    // todo check response
    state.config = ConvertJSON.toKeyboardJSON(res.data)
    state.layout = KeyboardLayout.ConvertFromKLE(state.config.layouts.keymap)
    state.jsonURL = stringURL
    console.info(state.config)
  }

  return { ...toRefs(state), loadJSONFromURL }
}
