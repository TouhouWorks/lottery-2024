<script lang="ts" setup>
import { computedAsync, toRefs, useDebounce, useScroll, watchDebounced } from '@vueuse/core'
import { computed, h, nextTick, onMounted, ref, watch } from 'vue'

const listUrl = '/api/getLotteries'

const list = computedAsync(async () => {
  const res = await fetch(listUrl)
  const data: {
    qqNumber: string
    nickname: string
    time: number
  }[] = await res.json()
  const mockData = []
  for (let i = 0; i < 20; i++) {
    const random = Math.floor(Math.random() * data.length)
    mockData.push(data[random])
  }
  return mockData
})

const el = ref<HTMLElement | null>(null)
const { x, y, isScrolling, arrivedState, directions } = useScroll(el, { behavior: 'smooth' })
const { left, right, top, bottom } = toRefs(arrivedState)

watchDebounced(y, (value) => {
  scroll()
}, { debounce: 15 })
function scroll() {
  if (bottom.value && list.value?.length > 0) {
    setTimeout(() => {
      y.value = 0
    }, 3000)
  }
  else {
    if (y.value === 0) {
      setTimeout(() => {
        y.value = 10
      }, 3000)
    }
    else {
      y.value += 10
    }
  }
}

watch(list, (value) => {
  setTimeout(() => {
    nextTick(() => {
      y.value += 10
    })
  }, 3000)
})
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
  <div class="flex flex-col items-center justify-start h-screen">
    <div class="flex flex-col items-center mt-2">
      <h1 class="text-4xl font-light text-purple-500">
        参与「幻夢結社」2024 高凉年例祭现场抽奖名单
      </h1>
    </div>
    <div ref="el" class="flex flex-col items-center mt-2 max-h-[90%] overflow-y-hidden">
      <div class="flex flex-col gap-4">
        <template v-for="(item) in list" :key="item">
          <div class="flex flex-row items-center justify-between w-[80vw]">
            <div class="flex flex-row items-center">
              <div class="flex flex-row items-center justify-center w-16 h-16 rounded-full">
                <img :src="`https://q1.qlogo.cn/g?b=qq&nk=${item.qqNumber}&s=640`" class="w-16 h-16 rounded-full">
              </div>
              <div class="flex flex-col ml-4">
                <span class="text-2xl">{{ item.nickname }}</span>
              </div>
            </div>
            <span class="text-lg font-light">{{ formatTime(item.time) }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
