<script lang="ts" setup>
import { computedAsync, toRefs, useDebounce, useScroll, watchDebounced } from '@vueuse/core'
import { computed, h, nextTick, onMounted, ref, watch } from 'vue'

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
const { x, y, isScrolling, arrivedState, directions } = useScroll(el, { behavior: 'smooth' })
const { left, right, top, bottom } = toRefs(arrivedState)

watchDebounced(y, (value) => {
  scroll()
}, { debounce: 15 })
function scroll() {
  if (bottom.value && list.value?.length > 0) {
    console.log('bottom')
    setTimeout(() => {
      y.value = 0
    }, 3000)
  }
  else {
    if (top.value) {
      console.log('top')
      setTimeout(() => {
        y.value = 10
      }, 3000)
    }
    else {
      console.log('normal scroll')
      y.value += 10
    }
  }
}

watch(list, (value) => {
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
      <p class="text-4xl text-white font-bold drop-shadow-sm px-2">
        参与「幻夢結社」2024 高凉年例祭现场抽奖名单
      </p>
      <p class="text-2xl text-white font-light drop-shadow-sm px-2">
        当前人数: {{ list?.length }}
      </p>
    </div>
    <div ref="el" class="flex flex-col items-center mt-2 max-h-[85%] overflow-y-hidden">
      <div class="flex flex-col gap-4">
        <template v-for="(item) in list" :key="item.qqNumber">
          <div class="flex flex-row items-center justify-between w-[50vw]">
            <div class="flex flex-row items-center">
              <div class="flex flex-row items-center justify-center w-16 h-16 rounded-full z-50">
                <img :src="`https://q1.qlogo.cn/g?b=qq&nk=${item.qqNumber}&s=640`" class="w-16 h-16 rounded-full shadow-sm">
              </div>
              <div class="flex flex-col ml-4">
                <span class="text-2xl text-white drop-shadow-sm">{{ item.nickname }}</span>
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
