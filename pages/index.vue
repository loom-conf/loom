<template>
  <div class="main">
    <div class="container">
      <div class="title">
        <div class="item">
          <div class="imgContainer" @click="clickLogo">
            <img src="@/assets/img/loom.png" width="64px" height="64px" />
            <div :class="logoBgClass"></div>
          </div>
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
  background-color: $bgColor;
  width: 100vw;
  height: 100vh;
  .container {
    position: absolute;
    width: calc(#{$bottomTabWidth} - 32px * 2);
    height: 118px;
    background: $mainBgColor;
    border-radius: 0 0 10% 10%;
    margin: 0 32px;
    .title {
      text-align: center;
      img {
        position: relative;
        z-index: 50;
      }
      .logoBg {
        position: absolute;
        z-index: 45;
        width: 30px;
        height: 30px;
        top: 18px;
        left: 28px;
        background-color: white;
        transition: all 2s ease;
        &.animate {
          background: linear-gradient(
            45deg,
            #ff2400,
            #e81d1d,
            #e8b71d,
            #e3e81d,
            #1de840,
            #1ddde8,
            #2b1de8,
            #dd00f3,
            #dd00f3
          );
          background-size: 1800% 1800%;
          animation: rainbow 3s ease infinite;
        }
      }
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
      background: $mainBgColor;
      bottom: 0;
      right: 20px;
    }
  }
  .keyboardEditor {
    overflow: hidden;
    width: 100%;
    height: 100vh;
  }

  @keyframes rainbow {
    0% {
      background-position: 0% 82%;
    }
    50% {
      background-position: 100% 19%;
    }
    100% {
      background-position: 0% 82%;
    }
  }
}
</style>

<script lang="ts">
import {
  defineComponent,
  useContext,
  computed,
  ref,
} from '@nuxtjs/composition-api'
import { mdiGithub } from '@mdi/js'
import KeyboardEditor from '@/components/KeyboardEditor.vue'
import AtomIcon from '@/components/atoms/AtomIcon.vue'

export default defineComponent({
  components: { KeyboardEditor, AtomIcon },
  setup(_props, _context) {
    const logoFlag = ref(false)
    const { route } = useContext()
    const keyboardName = computed(() => route.value.params.keyboard ?? '')
    const jsonURL = computed(() => route.value.query.config ?? '')

    const clickLogo = () => {
      logoFlag.value = !logoFlag.value
    }

    const logoBgClass = computed(() => [
      'logoBg',
      logoFlag.value ? 'animate' : '',
    ])

    return { mdiGithub, keyboardName, jsonURL, clickLogo, logoBgClass }
  },
})
</script>
