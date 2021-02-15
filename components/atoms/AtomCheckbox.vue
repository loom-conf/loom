<template>
  <div :class="checkboxClass" @click="clicked">
    <AtomIcon v-if="value" :icon="mdiCheck" class="checkmark" />
  </div>
</template>

<style lang="scss" scoped>
.checkbox {
  cursor: pointer;
  position: relative;
  padding: 0;
  width: 20px;
  height: 20px;
  border: 1px solid grey;
  overflow: hidden;
  .checkmark {
    position: absolute;
  }
}
</style>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { mdiCheck } from '@mdi/js'
import AtomIcon from '@/components/atoms/AtomIcon.vue'

export default defineComponent({
  components: { AtomIcon },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props, _context) {
    const checkboxClass = computed(() => ['checkbox'])
    const clicked = () => {
      _context.emit('toggle', !_props.value)
    }
    return { checkboxClass, clicked, mdiCheck }
  },
})
</script>
