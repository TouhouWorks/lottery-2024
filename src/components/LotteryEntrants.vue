<script lang="ts" setup>
import {
  computedAsync,
  toRefs,
  useScroll,
} from '@vueuse/core'

import {
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue'

import wait from 'wait'

const listUrl = '/api/getLotteries'

const list = computedAsync(async () => {
  console.log('first list')
  return await getList()
})
async function getList() {
  const res = await fetch(listUrl)
  const data: {
    qqNumber: string
    nickname: string
    time: number
  }[] = await res.json()
  // const mockData = []
  // for (let i = 0; i < 20; i++) {
  //   const random = Math.floor(Math.random() * data.length)
  //   mockData.push(data[random])
  // }
  // return mockData
  return data
}
const el = ref<HTMLElement | null>(null)
const { y, arrivedState } = useScroll(el, { behavior: 'smooth' })
const { bottom } = toRefs(arrivedState)

// watchDebounced(y, (value) => {
//   if (value === 0)
//     console.log('top')
//   else
//     scroll()
// }, { debounce: 15 })
const stopScroll = ref(false)
async function scroll() {
  await wait(100)
  if (!bottom.value && list.value?.length && list.value?.length > 0) {
    y.value += 10
    console.log('normal scroll', y.value)
  }
  if (bottom.value && list.value?.length && list.value?.length > 0 && y.value > 0) {
    console.log(`bottom arrived, y: ${y.value}`)
    stopScroll.value = true
    setTimeout(() => {
      y.value = 0
      stopScroll.value = false
      setTimeout(() => {
        scroll()
      }, 3000)
    }, 3000)
  }
  if (!stopScroll.value)
    requestAnimationFrame(scroll)

  // if (bottom.value && list.value?.length > 0) {
  //   console.log('bottom', y.value)
  //   setTimeout(() => {
  //     console.log('reset', y.value)
  //     y.value = 0
  //     console.log('reset', y.value)
  //   }, 3000)
  // }
  // else {
  //   if (top.value) {
  //     console.log('top', y.value)
  //     setTimeout(() => {
  //       y.value = 10
  //     }, 3000)
  //   }
  //   else {
  //     await wait(100)
  //     console.log('normal scroll', y.value)
  //     y.value += 10
  //   }
  // }
}
scroll()

watch(list, () => {
  console.log('list changed')
  setTimeout(() => {
    nextTick(() => {
      y.value += 10
    })
  }, 3000)
})

setInterval(async () => {
  list.value = await getList()
}, 60000)
onMounted(() => {
})
function formatTime(time: number) {
  const date = new Date(time)

  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')

  return `${hour}:${minute}`
}
</script>

<template>
  <div class="flex flex-col items-center justify-start background overflow-hidden w-screen h-screen">
    <div class="w-screen h-screen custom-bg fixed z-0" />
    <div class="flex flex-col items-center mt-4">
      <p class="text-2xl lg:text-4xl text-white font-bold drop-shadow-sm px-2 w-[calc(100vw-4rem)] lg:w-full">
        「幻夢結社」2024 高凉年例祭
      </p>
      <p class="text-2xl text-white font-light drop-shadow-sm px-2">
        参与现场抽奖人数: {{ list?.length }}
      </p>
    </div>
    <div ref="el" class="flex flex-col items-center mt-2 max-h-[85%] overflow-y-hidden">
      <div class="flex flex-col gap-4">
        <template v-for="(item) in list" :key="item.qqNumber">
          <div class="flex flex-row items-center justify-between w-screen px-8 lg:w-[50vw]">
            <div class="flex flex-row items-center">
              <div class="flex flex-row items-center justify-center w-16 h-16 rounded-full z-50">
                <img :src="`https://q1.qlogo.cn/g?b=qq&nk=${item.qqNumber}&s=640`" class="w-16 h-16 rounded-full shadow-sm">
              </div>
              <div class="flex flex-col ml-4">
                <span class="text-2xl text-white drop-shadow-sm line-clamp-1">{{ item.nickname }}</span>
              </div>
            </div>
            <span class="text-lg font-light text-white drop-shadow-sm">{{ formatTime(item.time) }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.custom-bg {
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(5px) brightness(0.5);
}
</style>
