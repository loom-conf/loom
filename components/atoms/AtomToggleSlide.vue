<template>
  <div class="toggleContaint">
    <div class="label" @click="clickLabel">
      <span class="toggleMark" :class="{ open: isOpen }">▼ </span>
      {{ label }}
    </div>
    <transition
      name="slide-down"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeleave"
      @leave="leave"
    >
      <div v-show="isOpen"><slot></slot></div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.label {
  user-select: none;
  cursor: pointer;
}
.toggleMark {
  display: inline-block;
  transition: 0.3s;
  &.open {
    transform: rotate(180deg);
    transition: 0.3s;
  }
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s;
}
.slide-down-enter-to,
.slide-down-leave {
  overflow: hidden;
}
.slide-down-enter,
.slide-down-leave-to {
  overflow: hidden;
}
</style>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props, _context) {
    const isOpen = ref(_props.value)
    const clickLabel = () => {
      isOpen.value = !isOpen.value
    }
    const beforeEnter = (el: HTMLElement) => {
      el.style.height = '0'
    }
    const enter = (el: HTMLElement) => {
      el.style.height = `${el.scrollHeight}px`
    }
    const beforeleave = (el: HTMLElement) => {
      el.style.height = `${el.scrollHeight}px`
    }
    const leave = (el: HTMLElement) => {
      el.style.height = '0'
    }
    return { clickLabel, isOpen, beforeEnter, enter, beforeleave, leave }
  },
})
</script>
