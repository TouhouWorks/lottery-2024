<script setup lang="ts">
import type { LotteryUser } from './types'

const props = defineProps<{
  user?: LotteryUser
  index: number
}>()

const displayUser = props.user || { uid: '', nickname: '', avatar: '', time: 0 }
</script>

<template>
  <div
    class="svg-motion-blur ibg flex flex-col gap-3 h-48 rounded-lg items-center justify-between w-[calc(20%-0.5rem)] shrink-0 shadow-md overflow-hidden"
  >
    <img
      :style="{
        filter: displayUser.avatar ? '' : 'grayscale(100%) contrast(40%) brightness(130%)',
        backgroundColor: displayUser.avatar ? '' : '#ffffff',
        padding: displayUser.avatar ? '' : '0.5rem',
      }"
      :src="displayUser.avatar ? `https://touhou.market/api/v1/images/${displayUser.avatar}?format=webp&q=100&size=m` : 'https://touhou.market/assets/logo.webp'"
      class="mt-auto rounded-full size-24 drop-shadow-md"
    >
    <span
      class="text-white drop-shadow-md mt-1 mb-auto text-lg font-semibold max-w-64 truncate"
      :data-index="index"
      :data-nickname="displayUser.nickname"
      :data-uid="displayUser.uid"
      :data-avatar="displayUser.avatar || ''"
      v-html="displayUser.nickname"
    />
  </div>
</template>

<style scoped>
.ibg {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}
.svg-motion-blur{
  -webkit-filter: url("#blur");
  filter: url("#blur");
}
</style>
