<script setup lang="ts">
import type { AwardType } from './types'
import { AWARD_COLORS } from './constants'

defineProps<{
  nickname: string
  uid: string
  avatar: string
  award: AwardType
  scale: number
  showAward: boolean
}>()
</script>

<template>
  <div
    :style="`transform: scale(${scale})`"
    class="scale z-50 ibg mx-1 flex h-fit rounded-lg items-center justify-center w-fit shrink-0 shadow-md overflow-hidden"
  >
    <div :class="{ 'flex-col items-center': !showAward, 'gap-6': showAward }" class="flex w-full p-8">
      <img
        :style="{
          filter: avatar ? '' : 'grayscale(100%) contrast(40%) brightness(130%)',
          backgroundColor: avatar ? '' : '#ffffff',
          padding: avatar ? '' : '0.5rem',
        }"
        :src="avatar ? `https://touhou.market/api/v1/images/${avatar}?format=webp&q=100&size=m` : 'https://touhou.market/assets/logo.webp'"
        class="mt-auto rounded size-24 drop-shadow-md"
      >
      <div class="flex flex-col justify-between mb-1">
        <div class="flex flex-col">
          <span
            class="text-white drop-shadow-md text-xl font-semibold truncate max-w-64"
            :class="{ 'min-w-32': showAward }"
            v-html="nickname"
          />
          <span v-if="showAward" class="scale text-white drop-shadow-md font-light">UID: {{ uid }}</span>
        </div>
        <div
          v-if="showAward"
          :class="[`bg-${AWARD_COLORS[award]}-500`]"
          class="flex items-center justify-center size-7 mr-auto rounded scale drop-shadow-md text-lg font-semibold text-white"
        >
          <span>{{ award }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ibg {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}
.scale {
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
