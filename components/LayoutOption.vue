<template>
  <div v-if="hasOptions">
    <div v-for="(item, index) in layoutOption.items" :key="`${item.label}`">
      <LayoutOptionToggle
        v-if="!item.options"
        :label="item.label"
        :value="item.value"
        :index="index"
        @toggle="optionChanged"
      />
      <LayoutOptionSelect
        v-else
        :label="item.label"
        :value="item.value"
        :options="item.options"
        :index="index"
        @change="optionChanged"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useKeymap } from '@/stores/useKeymap'

export default defineComponent({
  setup(_props, _context) {
    const { layoutOption, changeLayoutOption } = useKeymap()
    const hasOptions = computed(() => layoutOption.items?.length !== 0)
    const optionChanged = (index: number, value: number) => {
      if (layoutOption.items) {
        changeLayoutOption(index, value)
      }
    }

    return { layoutOption, hasOptions, optionChanged }
  },
})
</script>
