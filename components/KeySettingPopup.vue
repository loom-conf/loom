<template>
  <AtomModal :is-open="isOpen" @close="closeKeySetting">
    <div class="keySetting" :style="positionStyle">
      <SettingRawCode :raw="raw" @change="changeRawCode" />
      <AtomButton @click="doneKeySetting">OK</AtomButton>
      <AtomButton style="background-color: red" @click="doneKeySetting"
        >CANCEL</AtomButton
      >
    </div>
  </AtomModal>
</template>

<style lang="scss" scoped>
.keySetting {
  position: fixed;
  background-color: white;
  padding: 1rem;
  margin: 5px;
  border: 1px solid $bgColor;
  border-radius: 3px;
  box-shadow: 5px 5px rgba(black, 30%);
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useKeySettingModal } from '@/stores/useKeySettingModal'
import AtomModal from '@/components/atoms/AtomModal.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'
import SettingRawCode from '@/components/keySettings/SettingRawcode.vue'

export default defineComponent({
  components: { AtomModal, AtomButton, SettingRawCode },
  props: {},
  setup(_props, _context) {
    const {
      isOpen,
      keycode,
      position,
      closeKeySetting,
      setRawCode,
      doneKeySetting,
    } = useKeySettingModal()

    const positionStyle = computed(() => ({
      top: `${position.value?.y}px`,
      left: `${position.value?.x}px`,
    }))

    const raw = computed(() => keycode.value?.raw)

    const changeRawCode = (newRaw: number) => {
      setRawCode(newRaw)
    }

    return {
      isOpen,
      keycode,
      doneKeySetting,
      closeKeySetting,
      positionStyle,
      raw,
      changeRawCode,
    }
  },
})
</script>
