<template>
  <div class="editorSideMenu">
    <div class="title">USB</div>
    <div class="item" @click="clickFlash"><AtomIcon :icon="mdiUpload" /></div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  width: 25px;
  height: 25px;
  margin: 2.5px;
  text-align: center;
  font-weight: 500;
  color: $fontSubColor;
  border-radius: 2px;
  cursor: pointer;
  &.selected {
    border: $successColor solid 1px;
    background-color: $successColor;
    color: white;
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mdiUpload } from '@mdi/js'
import AtomIcon from '@/components/atoms/AtomIcon.vue'

export default defineComponent({
  components: { AtomIcon },
  setup(_props, _context) {
    const clickFlash = () => {
      _context.emit('upload')
    }

    return {
      mdiUpload,
      clickFlash,
    }
  },
})
</script>
