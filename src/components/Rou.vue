<script setup lang="ts">
import _ from 'lodash'
import wait from 'wait'
import { computedAsync } from '@vueuse/core'
import { computed, ref } from 'vue'

const listUrl = '/api/getLotteries'
const currentIndex = ref(0)
const time = ref(0)
const easing = ref('cubic-bezier(0.16, 1, 0.3, 1)')

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

const loaded = computed(() => {
  return (list?.value?.length || 0) > 0
})

let interval: NodeJS.Timeout | null = null

function linear() {
  easing.value = 'linear'
}

function easeOut() {
  easing.value = 'cubic-bezier(0.16, 1, 0.3, 1)'
}

async function startRoll() {
  linear()
  const cb = async () => {
    console.log(currentIndex.value)
    time.value = 0
    currentIndex.value = 0
    await wait(10)
    time.value = 10
    currentIndex.value = 995
  }
  await cb()
  return interval = setInterval(cb, 10 * 1000)
}

async function stopRoll(target: number) {
  if (interval === null)
    return
  easeOut()
  clearInterval(interval)
  currentIndex.value = 0
  time.value = 5
  currentIndex.value = target
  return wait(5 * 1000)
}

async function stop() {
  do {
    currentIndex.value = (Math.random() * 995)
    console.log(currentIndex.value)
  }
  while ((currentIndex.value % 1 <= 0.525) && (currentIndex.value % 1 >= 0.475))
  await stopRoll(currentIndex.value)
  const lotteried = Math.round(currentIndex.value + 3)
  const data = document.querySelector(`[data-index="${lotteried}"]`) as HTMLElement
  diceComplete(data.dataset)
}

function diceComplete(data: any) {
  console.log(data)
}
</script>

<template>
  <div>
    <div v-if="loaded" class="w-screen h-screen overflow-x-hidden">
      <div class="fixed flex gap-2 m-2 z-50">
        <input v-model="currentIndex" type="number" name="jump" class="rounded-md shadow-md">
        <button class=" bg-indigo-500 shadow-md rounded-md text-white px-2 py-1" type="button" @click="startRoll">
          开始
        </button>
        <button class=" bg-indigo-500 shadow-md rounded-md text-white px-2 py-1" type="button" @click="stop">
          停止
        </button>
      </div>
      <div class="fixed w-screen h-screen m-auto left-0 right-0 bottom-0 top-0 flex items-center justify-center">
        <div class="h-[60%] w-[1px] bg-black m-auto" />
      </div>

      <div class="h-full w-full">
        <div class="flex items-center shrink-0 h-full w-full" :style="`transition: all ${time}s ${easing};transform: translateX(-${currentIndex * 20}%)`">
          <!-- 前置防止抽到1-20数值 -->
          <div v-for="(item) in 1000" :key="item" class="px-2 flex flex-col rounded-lg  items-center justify-center w-[20%] shrink-0">
            <div class="px-2 mx-2 fixed border border-solid border-black w-[19%] h-[20%]" />
            <img :src="`https://q1.qlogo.cn/g?b=qq&nk=${tripleList[item % tripleList.length]?.qqNumber}&s=640`" class="rounded-full h-16 w-16 shadow-md m-3 mb-1">
            <span :data-index="item" :data-nickname="tripleList[item % tripleList.length]?.nickname" :data-qqNumber="tripleList[item % tripleList.length]?.qqNumber">{{ tripleList[item % tripleList.length].nickname }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center m-auto h-screen font-bold text-2xl">
      少女祈祷中...
    </div>
  </div>
</template>
