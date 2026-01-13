<script setup lang="ts">
import type { LotteryUser } from './types'
import { computed } from 'vue'

const props = defineProps<{
  user?: LotteryUser
  index: number
}>()

const displayUser = props.user || { uid: '', nickname: '', avatar: '', time: 0, type: '' }

const hasAvatar = computed(() => {
  if (displayUser.type === 'qq') {
    return true
  }
  return displayUser.avatar && displayUser.avatar.length > 0
})
const avatarUrl = computed(() => {
  if (displayUser.type === 'qq') {
    return `https://q1.qlogo.cn/g?b=qq&nk=${displayUser.uid}&s=100`
  }
  return displayUser.avatar
    ? `https://touhou.market/api/v1/images/${displayUser.avatar}?format=webp&q=100&size=m`
    : 'https://touhou.market/assets/logo.webp'
})
</script>

<template>
  <div
    class="svg-motion-blur ibg flex flex-col gap-3 h-48 rounded-lg items-center justify-between w-[calc(20%-0.5rem)] shrink-0 shadow-md overflow-hidden"
  >
    <img
      :class="{ 'avatar-placeholder': !hasAvatar && displayUser.type === 'thmk' }"
      :src="avatarUrl"
      class="mt-auto rounded-full size-24 drop-shadow-md"
    >
    <span
      class="text-white drop-shadow-md mt-1 mb-auto text-lg font-semibold max-w-64 truncate"
      :data-index="index"
      :data-nickname="displayUser.nickname"
      :data-uid="displayUser.uid"
      :data-avatar="displayUser.avatar || ''"
      :data-type="displayUser.type"
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
.avatar-placeholder {
  filter: grayscale(100%) contrast(40%) brightness(130%);
  background-color: #ffffff;
  padding: 0.5rem;
}
</style>
