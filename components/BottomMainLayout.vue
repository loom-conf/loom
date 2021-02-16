<template>
  <div v-if="hasOptions" class="block">
    <div v-for="(item, index) in layoutOption.items" :key="`${item.label}`">
      <BottomToggle
        v-if="!item.options"
        :label="item.label"
        :value="item.value"
        :index="index"
        @toggle="optionChanged"
      />
      <BottomSelect
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
import BottomToggle from '@/components/BottomToggle.vue'
import BottomSelect from '@/components/BottomSelect.vue'

export default defineComponent({
  components: { BottomToggle, BottomSelect },
  setup(_props, _context) {
    const { layoutOption, changeLayoutOption } = useKeymap()
    const hasOptions = computed(() => layoutOption.items?.length !== 0)
    const optionChanged = (value: number, index: number) => {
      if (layoutOption.items) {
        changeLayoutOption(index, value)
      }
    }

    return { layoutOption, hasOptions, optionChanged }
  },
})
</script>
