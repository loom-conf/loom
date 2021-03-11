<template>
  <form @submit.prevent="submit">
    <input
      :value="inputValue"
      :class="inputClass"
      :placeholder="label"
      type="text"
      @input="update"
      @blur="blur"
    />
  </form>
</template>

<style lang="scss" scoped>
input {
  outline: 0;
  background: white;
  border: 1px solid $fontSubColor;
  padding: 8px;
  color: $fontColor;
  font-size: 12px;
  border-radius: 1px;
  height: 32px;
  width: 100%;

  &:focus {
    border-color: cornflowerblue;
    transition: all 0.2s ease-in;
  }

  &.disabled {
    background: $disableColor;
    color: lighten($disableColor, 20%);
    cursor: not-allowed;
  }
}
</style>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  watch,
  toRef,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
  },
  setup(_props, _context) {
    const inputValue = ref(_props.value)

    watch(toRef(_props, 'value'), () => {
      inputValue.value = _props.value
    })

    const inputClass = computed(() => (_props.disabled ? 'disabled' : ''))
    const update = (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        inputValue.value = event.target.value
        _context.emit('input', inputValue.value)
      }
    }
    const submit = (event: Event) => {
      if (event.target instanceof HTMLFormElement) {
        _context.emit('submit', inputValue.value)
      }
    }

    const blur = (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        _context.emit('blur', inputValue.value)
      }
    }

    return { inputValue, inputClass, update, submit, blur }
  },
})
</script>
