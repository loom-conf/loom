<template>
  <AtomModal :is-open="isOpen" @close="closeKeySetting">
    <div class="keySetting" :style="positionStyle">
      <SettingRawCode :raw="raw" @change="changeRawCode" />
      <AtomButton @click="doneKeySetting">OK</AtomButton>
      <AtomButton style="background-color: red" @click="doneKeySetting"
        >back</AtomButton
      >
    </div>
  </AtomModal>
</template>

<style lang="scss" scoped>
.keySetting {
  position: fixed;
  background-color: white;
  margin-top: 4px;
  padding: 1rem;
  border: 1px solid $bgColor;
  border-radius: 3px;
  box-shadow: 5px 5px rgba(black, 0.3);
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useKeySettingPopup } from '@/stores/useKeySettingPopup'
import AtomModal from '@/components/atoms/AtomModal.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'
import SettingRawCode from '@/components/keySettings/SettingRawcode.vue'

export default defineComponent({
  components: { AtomModal, AtomButton, SettingRawCode },
  props: {},
  setup(_props, _context) {
    const {
      popupWidth,
      isOpen,
      keycode,
      position,
      closeKeySetting,
      setRawCode,
      doneKeySetting,
    } = useKeySettingPopup()

    const positionStyle = computed(() =>
      position.value?.isRight
        ? {
            width: `${popupWidth}px`,
            top: `${position.value?.y}px`,
            left: `${position.value?.x}px`,
          }
        : {
            width: `${popupWidth}px`,
            top: `${position.value?.y}px`,
            right: `${position.value?.x}px`,
          }
    )

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
