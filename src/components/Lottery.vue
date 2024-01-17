<script setup lang="ts">
import _ from 'lodash'
import { computedAsync, useAnimate, useScroll } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

const el = ref<HTMLElement | null>(null)
const an = ref<HTMLElement | null>(null)
const {
  startTime,
  currentTime,
  play,
  pause,
  cancel,
  playState,
} = useAnimate(an, { marginRight: '27rem' }, {
  duration: 1000,
})

watch(playState, (val) => {
  if (val !== 'running')
    play()
})

const { x, y, isScrolling, arrivedState, directions } = useScroll(el)

const listUrl = '/api/getLotteries'

const list = computedAsync(async () => {
  const res = await fetch(listUrl)
  const data: {
    qqNumber: string
    nickname: string
    time: number
  }[] = await res.json()
  return data
})

const tripleList = computed(() => {
  const shuffled = _.shuffle(list.value)
  return shuffled.concat(shuffled.concat(shuffled))
})

function start() {
  play()
}
</script>

<template>
  <div class="flex flex-col items-center">
    <h1>我局的事你</h1>
    <button class="rounded-md bg-indigo-500 text-white px-4 py-2 shadow-md m-4" @click="start">
      看看
    </button>
    <div ref="el" class="overflow-scroll w-48 overflow-x-hidden overflow-y-hidden">
      <div class="flex gap-2 justify-center">
        <div v-for="item in tripleList" :key="item.qqNumber" class="shrink-0">
          <div class="flex flex-col items-center shrink-0">
            <img :src="`https://q1.qlogo.cn/g?b=qq&nk=${item.qqNumber}&s=640`" class="rounded-full h-16 w-16 shadow-md">
            {{ item.nickname }}
          </div>
        </div>
        <div ref="an" class="w-0" />
      </div>
    </div>
  </div>
</template>
