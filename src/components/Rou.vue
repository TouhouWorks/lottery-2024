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

const clsNames = [
  '幻',
  '夢',
  '結',
]

async function startRoll(cls: number) {
  linear()
  time.value = 0
  currentIndex.value = 0
  await wait(10)
  const cb = async () => {
    if (currentIndex.value <= 500) {
      console.log('start')
      time.value = 5
      currentIndex.value += 500
    }
    else {
      console.log('end')
      time.value = 0
      currentIndex.value = 0
      await cb()
    }
  }
  await cb()
  interval = setInterval(cb, 5 * 1000)
  await wait(5 * 1000)
  stop(cls)
}

async function stopRoll(target: number) {
  if (interval === null)
    return
  easeOut()
  clearInterval(interval)
  time.value = 0
  currentIndex.value = 0
  await wait(10)
  time.value = 5
  currentIndex.value = target
  return wait(5 * 1000)
}

async function stop(cls: number) {
  do {
    currentIndex.value = (Math.random() * 995)
    console.log(currentIndex.value)
  }
  while ((currentIndex.value % 1 <= 0.55) && (currentIndex.value % 1 >= 0.45))
  await stopRoll(currentIndex.value)
  const lotteried = Math.round(currentIndex.value + 3)
  const data = document.querySelector(`[data-index="${lotteried}"]`) as HTMLElement
  diceComplete(data.dataset, cls)
}

function diceComplete(data: any, cls: number) {
  console.log(data, clsNames[cls])
}
</script>

<template>
  <div class="flex justify-center bg-gray-300">
    <div v-if="loaded" class="w-[90vw] h-screen overflow-x-hidden">
      <div class="fixed flex m-2 z-50 w-[90vw]">
        <input v-model="currentIndex" type="number" name="jump" class="rounded-md shadow-md mr-auto">
        <button class="bg-purple-500 shadow-md rounded-md text-white px-4 py-1 mx-2" type="button" @click="startRoll(0)">
          幻
        </button>
        <button class="bg-red-500 shadow-md rounded-md text-white px-4 py-1 mx-2" type="button" @click="startRoll(1)">
          夢
        </button>
        <button class="bg-blue-500 shadow-md rounded-md text-white px-4 py-1 mx-2" type="button" @click="startRoll(2)">
          結
        </button>
      </div>
      <div class="fixed m-auto w-screen h-48 left-0 right-0 bottom-0 top-0 flex items-center justify-center z-40">
        <div class="h-40 w-40 z-50 gl" />
        <div class="h-40 w-[3px] bg-yellow-300 m-auto shadow-yellow-600 shadow-md z-50" />
        <div class="h-40 w-40 z-50 gr" />
      </div>

      <div class="h-full w-full">
        <div class="flex items-center shrink-0 h-full w-full" :style="`transition: all ${time}s ${easing};transform: translateX(-${currentIndex * 20}%)`">
          <div v-for="(item) in 1000" :key="item" class="bg-gradient-to-t from-blue-800 from-0%  via-blue-400 to-gray-200 to-35% mx-1 flex flex-col h-40 rounded-lg items-center justify-center w-[calc(20%-0.5rem)] shrink-0 border border-gray-500 shadow-md overflow-hidden">
            <img :src="`https://q1.qlogo.cn/g?b=qq&nk=${tripleList[item % tripleList.length]?.qqNumber}&s=640`" class="mt-auto rounded-full size-16 shadow-md m-3 mb-1">
            <span :data-index="item" :data-nickname="tripleList[item % tripleList.length]?.nickname" :data-qqNumber="tripleList[item % tripleList.length]?.qqNumber">{{ tripleList[item % tripleList.length].nickname }}</span>
            <div class="mt-auto w-full h-2 bg-blue-600" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center m-auto h-screen font-bold text-2xl">
      少女祈祷中...
    </div>
  </div>
</template>

<style scoped>
.gl {
  background-image: url('/assets/images/gl.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.gr {
  background-image: url('/assets/images/gr.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
