<template>
  <div class="main">
    <div class="titleWrapper">
      <div class="title">
        <div class="item">
          <img src="@/assets/img/loom.png" width="64px" height="64px" />
        </div>
        <div class="loom">LOOM</div>
      </div>
    </div>
    <KeyboardEditor
      class="keyboardEditor"
      :default-json-url="jsonURL"
      :default-keyboard-name="keyboardName"
    />
    <div class="footer copyright">© 2021 hsgw, All right reserved.</div>
  </div>
</template>

<style lang="scss">
body::-webkit-scrollbar {
  display: none;
}

.main {
  background-color: silver;
  width: 100vw;
  height: 100vh;
  .titleWrapper {
    position: absolute;
    z-index: 10;
    width: calc(#{$bottomTabWidth} - 32px * 2);
    height: 118px;
    top: 0;
    left: 0;
    background: white;
    border-radius: 0 0 10% 10%;
    margin: 0 32px;
    .title {
      text-align: center;
      .loom {
        margin: 0.3rem 0;
        font-size: medium;
        font-weight: 500;
        transform: rotateZ(345deg);
        transition: 1s ease-out;
        &:hover {
          cursor: none;
          transition: 100000s;
          transform: rotateZ(999999999deg);
        }
      }
    }
  }
  .footer {
    z-index: 100;
    position: absolute;
    padding: 0.2rem;
    font-size: smaller;
    &.copyright {
      text-align: right;
      background: white;
      bottom: 0;
      right: 20px;
    }
  }
}

.keyboardEditor {
  overflow: hidden;
  width: 100%;
  height: 100vh;
}
</style>

<script lang="ts">
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
import KeyboardEditor from '~/components/KeyboardEditor.vue'

export default defineComponent({
  components: { KeyboardEditor },
  setup(_props, _context) {
    const { route } = useContext()
    const keyboardName = computed(() => route.value.params.keyboard ?? '')
    const jsonURL = computed(() => route.value.query.config ?? '')

    return { keyboardName, jsonURL }
  },
})
</script>
