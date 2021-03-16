<template>
  <div class="appSetting">
    <div class="item">
      <div class="header">Viewer</div>
      <div class="containt">
        <BottomToggle
          :value="viewerOption.hideUnselectedLayout"
          label="Hide keys in unselected layout"
          @toggle="toggleHidekeyButon"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.appSetting {
  height: 0;
  .label {
    min-width: 350px;
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useAppSetting } from '@/stores/useAppSetting'
import BottomToggle from '@/components/BottomToggle.vue'

export default defineComponent({
  components: { BottomToggle },
  setup(_props, _context) {
    const { viewerOption, setViewerOption } = useAppSetting()
    const toggleHidekeyButon = () => {
      viewerOption.value.hideUnselectedLayout = !viewerOption.value
        .hideUnselectedLayout
      setViewerOption(viewerOption.value)
    }
    return { viewerOption, toggleHidekeyButon }
  },
})
</script>
