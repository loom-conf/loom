<template>
  <AtomModal :is-open="isOpen" class="dialogContainer">
    <div class="dialog">
      <div class="header">{{ state.header }}</div>
      <div class="message">{{ state.message }}</div>
      <div class="buttonContainer">
        <AtomButton @click="close(true)">OK</AtomButton>
        <AtomButton
          v-if="state.hasCancel"
          class="cancelButton"
          @click="close(false)"
          >Cancel</AtomButton
        >
      </div>
    </div>
  </AtomModal>
</template>

<style lang="scss" scoped>
.dialogContainer {
  background-color: rgba($bgColor, 0.9);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .dialog {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 10px solid black;
    border-radius: 10px;
    background-color: white;
    min-width: 400px;
    padding: 1rem;
    .header {
      font-size: x-large;
      font-weight: 900;
      margin-top: -0.5rem;
    }
    .message {
      flex: 1;
    }
    .buttonContainer {
      display: flex;
      justify-content: flex-end;
      margin-top: 3rem;
      .cancelButton {
        margin-left: 10px;
        background-color: $errorColor;
        &:hover {
          background-color: darken($errorColor, 15%);
        }
      }
    }
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useDialog } from '@/stores/useDialog'
import AtomModal from '@/components/atoms/AtomModal.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'

export default defineComponent({
  components: { AtomModal, AtomButton },
  setup(_props, _context) {
    const { isOpen, state, close } = useDialog()
    return { isOpen, state, close }
  },
})
</script>
