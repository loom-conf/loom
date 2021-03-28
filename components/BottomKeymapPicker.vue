<template>
  <div class="keymapPicker">
    <div v-for="kind in BaseKeycodeKind" :key="kind" class="container">
      <div class="label">{{ kind }}</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in findKeysByKind(kind)"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.keymapPicker {
  padding: 1rem 0 2rem 0;
  max-width: 1000px;
  .container {
    .label {
      font-weight: 500;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import KeymapPickerKey from '@/components/KeymapPickerKey.vue'
import { BaseKeycodes } from '@/utils/keycodes'
import { BaseKeycodeKind, BaseKeycodeKindType } from '@/utils/keycodeTypes'

export default defineComponent({
  components: { KeymapPickerKey },
  setup(_props, _context) {
    const findKeysByKind = (kind: BaseKeycodeKindType) => {
      return BaseKeycodes.filter((v) => v.kind === kind).map((v) => ({
        kind: ['BASIC', 'KEYPAD', 'MOD'].includes(v.kind) ? 'BASIC' : 'SPECIAL',
        qmk: v.qmk,
        raw: v.raw,
        base: v,
        mods: [],
      }))
    }
    return { BaseKeycodeKind, findKeysByKind }
  },
})
</script>
