<script setup lang="ts">
import _ from 'lodash'
import wait from 'wait'
import { computedAsync } from '@vueuse/core'
import { computed, ref } from 'vue'

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

const loaded = computed(() => {
  return (list?.value?.length || 0) > 0
})

const currentIndex = ref(0)
const stoped = ref(true)
const mixCount = ref(0)
const time = ref(0.2)// 过度时间
const defaultCount = ref(20) // 默认的动画个数

async function runTask(num: number) {
  console.log(currentIndex.value, num + defaultCount.value)
  if (currentIndex.value >= num + defaultCount.value) {
    stoped.value = true
    console.log(`恭喜你抽中了${num + defaultCount.value}`)
    const data = document.querySelector(`[data-index="${num + defaultCount.value}"]`) as HTMLElement
    console.log(data.dataset.qqnumber)
    return data
  }

  // 前20%是慢速
  // 20%到80%快速
  // 80%到100%是慢速
  if (mixCount.value <= defaultCount.value && mixCount.value > defaultCount.value * 0.8) {
    time.value = 1
    await wait(500)
  }
  else {
    time.value = 0.2
    await wait(50)
  }
  mixCount.value += 1
  currentIndex.value += 1
  return runTask(num)
}

function run() {
  if (!stoped.value)
    return
  stoped.value = false
  const num = Math.floor(Math.random() * tripleList.value.length + 1)
  console.log(num)
  currentIndex.value = num - defaultCount.value
  mixCount.value = 0
  runTask(num - defaultCount.value)
}

function start() {
  time.value = 10
  currentIndex.value = (Math.random() * 995)
}
</script>

<template>
  <div>
    <div v-if="loaded" class="w-screen h-screen overflow-x-hidden">
      <div class="fixed flex gap-2 m-2 z-50">
        <input v-model="currentIndex" type="number" name="jump" class="rounded-md shadow-md">
        <button class=" bg-indigo-500 shadow-md rounded-md text-white px-2 py-1" type="button" @click="start">
          开始
        </button>
      </div>
      <div class="fixed w-screen h-screen m-auto left-0 right-0 bottom-0 top-0 flex items-center justify-center">
        <div class="h-[60%] w-[1px] bg-black m-auto" />
      </div>

      <div class="h-full w-full">
        <div class="flex items-center shrink-0 h-full w-full" :style="`transition: all ${time}s cubic-bezier(0.16, 1, 0.3, 1);transform: translateX(-${currentIndex * 20}%)`">
          <!-- 前置防止抽到1-20数值 -->
          <div v-for="(item) in 1000" :key="item" class="px-2 flex flex-col rounded-lg  items-center justify-center w-[20%] shrink-0">
            <div class="px-2 mx-2 fixed border border-solid border-black w-[19%] h-[20%]" />
            <img :src="`https://q1.qlogo.cn/g?b=qq&nk=${tripleList[item % tripleList.length]?.qqNumber}&s=640`" class="rounded-full h-16 w-16 shadow-md m-3 mb-1">
            <span :data-index="item" :data-qqNumber="tripleList[item % tripleList.length]?.qqNumber">{{ tripleList[item % tripleList.length].nickname }}</span>
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center m-auto h-screen font-bold text-2xl">
      少女祈祷中...
    </div>
  </div>
</template>
