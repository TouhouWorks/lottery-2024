<script setup lang="ts">
import { CLASS_NAMES } from './constants'

defineProps<{
  clicked: boolean
  fetchingRandom: boolean
}>()

const emit = defineEmits<{
  startRoll: [index: number]
  reload: []
}>()

function handleStartRoll(index: number) {
  emit('startRoll', index)
}

function handleReload() {
  emit('reload')
}
</script>

<template>
  <div v-if="!clicked" class="fixed flex m-2 z-50 mt-5">
    <button
      v-for="(name, index) in CLASS_NAMES"
      :key="name"
      :class="[
        index === 0 ? 'bg-purple-500 text-purple-100' : '',
        index === 1 ? 'bg-red-500 text-red-100' : '',
        index === 2 ? 'bg-blue-500 text-blue-100' : '',
      ]"
      class="shadow-md rounded-md px-5 py-1 mx-3"
      type="button"
      @click="handleStartRoll(index)"
    >
      {{ name }}
    </button>
  </div>
  <div v-else class="fixed flex m-2 z-50 mt-5">
    <button
      v-show="!fetchingRandom"
      class="bg-green-500 shadow-md rounded-md text-green-100 px-5 py-1 mx-3"
      type="button"
      @click="handleReload"
    >
      重新开始
    </button>
    <span v-if="fetchingRandom" class="text-white px-5 py-1 mx-3">
      正在获取随机数...
    </span>
  </div>
</template>
