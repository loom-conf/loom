<template>
  <div class="layoutOption">
    <div v-if="hasOptions" class="block">
      <div v-for="(item, index) in layoutOption.items" :key="`${item.label}`">
        <BottomToggle
          v-if="!item.options"
          :label="item.label"
          :value="!!item.value"
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
    <div v-else class="block">No layout options</div>
  </div>
</template>

<style lang="scss">
.layoutOption {
  height: 0;
  .label {
    min-width: 250px;
  }
}
</style>

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
    const optionChanged = (value: number | boolean, index: number) => {
      if (layoutOption.items) {
        if (typeof value === 'boolean') {
          changeLayoutOption(index, value ? 1 : 0)
        } else {
          changeLayoutOption(index, value)
        }
      }
    }

    return { layoutOption, hasOptions, optionChanged }
  },
})
</script>
