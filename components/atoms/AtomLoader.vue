<!--
From loaders.css
https://github.com/ConnorAtherton/loaders.css

The MIT License (MIT)
Copyright (c) 2016 Connor Atherton
-->

<template>
  <div class="ball-pulse">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes scale {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  45% {
    transform: scale(0.1);
    opacity: 0.7;
  }
  80% {
    transform: scale(1);
    opacity: 1;
  }
}

.ball-pulse > div {
  background-color: grey;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  margin: 7px;
  animation-fill-mode: both;
  display: inline-block;
  transition: all 0.5s;
}

.ball-pulse > div:nth-child(1) {
  animation: scale 1.2s -0.3s infinite cubic-bezier(0.2, 0.68, 0.1, 1.08);
}

.ball-pulse > div:nth-child(2) {
  animation: scale 1.2s -0.15s infinite cubic-bezier(0.2, 0.68, 0.1, 1.08);
}

.ball-pulse > div:nth-child(3) {
  animation: scale 1.2s 0s infinite cubic-bezier(0.2, 0.68, 0.1, 1.08);
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup(_props, _context) {
    return {}
  },
})
</script>
