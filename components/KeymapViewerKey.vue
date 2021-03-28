<template>
  <div v-if="isVisible" class="keyContainer" :style="outerStyle">
    <div
      ref="keyRef"
      class="keyBody"
      :class="borderClass"
      @drop="drop"
      @dragenter.prevent
      @dragover.prevent
    >
      <div
        class="event"
        :draggable="keycode"
        @click="click"
        @dragover="dragOver"
        @dragleave="dragLeave"
        @dragstart="dragStart"
        @dragend="dragEnd"
      >
        <div
          v-if="!keycode"
          class="label"
          v-html="labelWithoutKeycodeHtml"
        ></div>
        <component :is="keyComponent" v-else :keycode="keycode" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keyContainer {
  position: absolute;
  z-index: 1000;
  padding: 1px;
  user-select: none;
  .keyBody {
    overflow: hidden;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 2px;
    background-color: white;
    transition: all 0.2s;
    &.disabled {
      background-color: $disableColor;
      color: lighten($disableColor, 50%);
    }
    &.openingSetting {
      background-color: lighten($successColor, 25%);
    }
    &.dragOver {
      border: 3px solid $successColor;
    }
    &.dragging {
      border: 3px solid $subColor;
    }
    .event {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .label {
      margin-left: 0.2rem;
    }
  }
}
</style>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
} from '@nuxtjs/composition-api'
import { KeyLayout } from '@/models/keyboardLayout'
import { KeycodeTypes } from '@/utils/keycodeTypes'
import { useConsts } from '@/stores/useConsts'
import { useKeySettingPopup } from '@/stores/useKeySettingPopup'
import { getKeyComponent } from '@/models/keytop'

export default defineComponent({
  props: {
    keyLayout: {
      type: Object as PropType<KeyLayout>,
      required: true,
    },
    keycode: {
      type: Object as PropType<KeycodeTypes>,
      required: false,
      default: undefined,
    },
    keycodeIndex: {
      type: Number,
      required: false,
      default: undefined,
    },
  },

  setup(_props, _context) {
    const keyRef = ref<HTMLDivElement>()
    const isOpeningSetting = ref(false)
    const isDragOver = ref(false)
    const isDragging = ref(false)

    const { KeyConsts, calcKeySize } = useConsts()
    const { popupWidth, openKeySetting } = useKeySettingPopup()

    const width = computed(() => calcKeySize(_props.keyLayout.width))
    const height = computed(() => calcKeySize(_props.keyLayout.height))
    const top = computed(
      () => calcKeySize(_props.keyLayout.y) + KeyConsts.outerMargin
    )
    const left = computed(
      () => calcKeySize(_props.keyLayout.x) + KeyConsts.outerMargin
    )

    const outerStyle = computed(() => {
      return {
        width: `${width.value}px`,
        height: `${height.value}px`,
        top: `${top.value}px`,
        left: `${left.value}px`,
        'transform-origin': `${calcKeySize(
          _props.keyLayout.rotation_x - _props.keyLayout.x
        )}px
        ${calcKeySize(_props.keyLayout.rotation_y - _props.keyLayout.y)}px`,
        transform: `rotate(${_props.keyLayout.rotation_angle}deg)`,
      }
    })

    const borderClass = computed(() => ({
      disabled: isDisabled.value,
      openingSetting: isOpeningSetting.value,
      dragOver: isDragOver.value,
      dragging: isDragging.value,
    }))

    const labelWithoutKeycodeHtml = computed(
      () =>
        `${_props.keyLayout.labels[0]}` +
        (_props.keyLayout.layoutOption
          ? `<br />${_props.keyLayout.layoutOption?.layout},${_props.keyLayout.layoutOption?.value}`
          : '')
    )

    const keyComponent = computed(() => getKeyComponent(_props.keycode.kind))

    const isVisible = computed(
      () => !_props.keyLayout.disabled && !_props.keyLayout.decal
    )

    const isDisabled = computed(() => _props.keyLayout.disabled)

    const click = () => {
      const rect = keyRef.value?.getBoundingClientRect()
      if (rect) {
        const isRight = rect.right + popupWidth < window.innerWidth
        if (_props.keycode) {
          isOpeningSetting.value = true
          openKeySetting(
            {
              x: isRight ? rect.left : window.innerWidth - rect.right,
              y: rect.bottom,
              isRight,
            },
            _props.keycode,
            (newKeycode) => {
              _context.emit('update-keycode', newKeycode, _props.keycodeIndex)
            },
            () => {
              isOpeningSetting.value = false
            }
          )
        }
      }
    }

    const dragStart = (event: DragEvent) => {
      isDragging.value = true
      if (event.dataTransfer)
        event.dataTransfer.setData('keycode', JSON.stringify(_props.keycode))
    }
    const dragEnd = (event: DragEvent) => {
      isDragging.value = false
      if (event.dataTransfer) event.dataTransfer.setData('keycode', '')
    }

    const dragOver = () => {
      isDragOver.value = true
    }

    const dragLeave = () => {
      isDragOver.value = false
    }

    const drop = (event: DragEvent) => {
      isDragOver.value = false
      if (event.dataTransfer) {
        const newKeycode = JSON.parse(event.dataTransfer.getData('keycode'))
        if (newKeycode)
          _context.emit('update-keycode', newKeycode, _props.keycodeIndex)
      }
      event.preventDefault()
    }

    return {
      keyRef,
      outerStyle,
      borderClass,
      labelWithoutKeycodeHtml,
      keyComponent,
      isVisible,
      isDisabled,
      click,
      dragStart,
      dragEnd,
      dragOver,
      dragLeave,
      drop,
    }
  },
})
</script>

function getKeyComponent(kind: string): any { throw new Error('Function not
implemented.') }
