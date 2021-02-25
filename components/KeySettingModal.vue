<template>
  <AtomModal :is-open="isOpen" @close="closeKeySetting">
    <div class="keySetting" :style="positionStyle">
      <div>Raw</div>
      <div>
        <AtomInput
          :value="raw !== undefined ? raw.toString() : undefined"
          @submit="changeRawCode"
          @blur="changeRawCode"
        />
      </div>
      <AtomButton @click="doneKeySetting">OK</AtomButton>
    </div>
  </AtomModal>
</template>

<style lang="scss" scoped>
.keySetting {
  position: fixed;
  background-color: white;
  padding: 1rem;
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useKeySettingModal } from '@/stores/useKeySettingModal'
import AtomModal from '@/components/atoms/AtomModal.vue'
import AtomInput from '@/components/atoms/AtomInput.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'

export default defineComponent({
  components: { AtomModal, AtomInput, AtomButton },
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

    const changeRawCode = (input: string) => {
      const newRaw = parseInt(input)
      if (isNaN(newRaw)) return
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
