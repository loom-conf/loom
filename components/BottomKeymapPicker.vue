<template>
  <div class="keymapPicker">
    <div v-for="kind in BaseKeycodeKind" :key="kind" class="container">
      <div class="label">{{ kind }}</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in findBaseKeysByKind(kind)"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Layer Tap</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in layerTapKeycodes"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Layer On</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in layerOnKeycodes"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Layer Momentary</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in layerMomentaryKeycodes"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Layer Default</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in layerDefaultKeycodes"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Layer Toggle</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in layerToggleKeycodes"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Layer Oneshot</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in layerOneshotKeycodes"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Layer TapToggle</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in layerTapToggleKeycodes"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Layer Mod</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in layerModKeycodes"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Mod Oneshot</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in modOneshotKeycodes"
          :key="keycode.raw"
          :keycode="keycode"
        />
      </div>
    </div>
    <div class="container">
      <div class="label">Mod Tap</div>
      <div class="content">
        <KeymapPickerKey
          v-for="keycode in modTapKeycodes"
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
import { computed, defineComponent } from '@nuxtjs/composition-api'
import KeymapPickerKey from '@/components/KeymapPickerKey.vue'
import { BaseKeycodes, buildKeycodeFromRaw, RawBase } from '@/utils/keycodes'
import { BaseKeycodeKind, BaseKeycodeKindType } from '@/utils/keycodeTypes'
import { useKeyboard } from '@/stores/useKeyboard'

export default defineComponent({
  components: { KeymapPickerKey },
  setup(_props, _context) {
    const { deviceConfig } = useKeyboard()
    const layerCount = computed(() => deviceConfig.value?.layerCount ?? 4)

    const findBaseKeysByKind = (kind: BaseKeycodeKindType) => {
      return BaseKeycodes.filter((v) => v.kind === kind).map((v) => ({
        kind: ['BASIC', 'KEYPAD', 'MOD'].includes(v.kind) ? 'BASIC' : 'SPECIAL',
        qmk: v.qmk,
        raw: v.raw,
        base: v,
        mods: [],
      }))
    }

    const layerTapKeycodes = computed(() =>
      [...Array(layerCount.value)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.LAYER_TAP + (i << 8) + 40)
      )
    )

    const layerOnKeycodes = computed(() =>
      [...Array(layerCount.value)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.LAYER_ON + i)
      )
    )

    const layerMomentaryKeycodes = computed(() =>
      [...Array(layerCount.value)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.LAYER_MOMENTARY + i)
      )
    )

    const layerDefaultKeycodes = computed(() =>
      [...Array(layerCount.value)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.LAYER_DEFAULT + i)
      )
    )

    const layerToggleKeycodes = computed(() =>
      [...Array(layerCount.value)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.LAYER_TOGGLE + i)
      )
    )

    const layerOneshotKeycodes = computed(() =>
      [...Array(layerCount.value)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.LAYER_ONESHOT + i)
      )
    )

    const layerTapToggleKeycodes = computed(() =>
      [...Array(layerCount.value)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.LAYER_TAPTOGGLE + i)
      )
    )

    const layerModKeycodes = computed(() =>
      [...Array(layerCount.value)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.LAYER_MOD + (i << 4) + 2)
      )
    )

    const modOneshotKeycodes = computed(() =>
      [...Array(4)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.MOD_ONESHOT + (1 << i))
      )
    )

    const modTapKeycodes = computed(() =>
      [...Array(4)].map((_, i) =>
        buildKeycodeFromRaw(RawBase.MOD_TAP + (((1 << i) << 8) + 40))
      )
    )

    return {
      BaseKeycodeKind,
      findBaseKeysByKind,
      layerTapKeycodes,
      layerOnKeycodes,
      layerMomentaryKeycodes,
      layerDefaultKeycodes,
      layerToggleKeycodes,
      layerOneshotKeycodes,
      layerTapToggleKeycodes,
      layerModKeycodes,
      modOneshotKeycodes,
      modTapKeycodes,
    }
  },
})
</script>
