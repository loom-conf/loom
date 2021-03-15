<template>
  <table class="historyTable">
    <tr v-for="config in history" :key="`${config.name}${config.index}`">
      <td
        :class="{ enable: config.isPinned }"
        class="pin"
        @click="clickHistoryPin(config.index)"
      >
        ★
      </td>
      <td class="name">{{ config.name }}</td>
      <td class="src">
        <a :href="config.src">{{ config.src }}</a>
      </td>
      <td
        v-if="!config.isPinned"
        class="remove"
        @click="clickRemoveHistory(config.index)"
      >
        <AtomIcon class="icon" :icon="mdiDeleteForever" />
      </td>
    </tr>
  </table>
</template>

<style lang="scss" scoped>
.historyTable {
  .pin {
    cursor: pointer;
    color: $disableColor;
    &.enable {
      color: $successColor;
    }
  }
  .name {
    cursor: pointer;
    padding: 0 8px 0 0;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
  .src {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: x-small;
  }
  .remove {
    cursor: pointer;
    color: $fontSubColor;
    padding-left: 4px;
    .icon {
      width: 16px;
    }
    &:hover {
      color: $errorColor;
    }
  }
}
</style>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { mdiDeleteForever } from '@mdi/js'
import AtomIcon from '@/components/atoms/AtomIcon.vue'

export default defineComponent({
  components: { AtomIcon },
  props: {
    history: {
      type: Array as PropType<
        Array<{ index: number; name: string; src: string }>
      >,
      required: true,
    },
  },
  setup(_props, _context) {
    const clickHistoryPin = (index: number) => {
      _context.emit('clickPin', index)
    }
    const clickRemoveHistory = (index: number) => {
      _context.emit('clickRemove', index)
    }
    return { mdiDeleteForever, clickHistoryPin, clickRemoveHistory }
  },
})
</script>
