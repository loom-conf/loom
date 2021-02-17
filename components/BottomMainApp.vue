<template>
  <div class="appSetting">
    <div class="block">
      <h3>Viewer</h3>
      <div class="item">
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
    const { viewerOption } = useAppSetting()
    const toggleHidekeyButon = () => {
      viewerOption.hideUnselectedLayout = !viewerOption.hideUnselectedLayout
    }
    return { viewerOption, toggleHidekeyButon }
  },
})
</script>
