<script setup lang="ts">
import _, { transform } from 'lodash'
import wait from 'wait'
import { computedAsync } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

const listUrl = '/api/getLotteries'
const currentIndex = ref(0)
const time = ref(0)
const easing = ref('cubic-bezier(0.16, 1, 0.3, 1)')
const showList = ref(true)
const targetNickname = ref('')
const targetQqNumber = ref('')
const cardScale = ref(1)
const showAward = ref(false)
const targetAward = ref('')
const showLine = ref(true)
const clsNames = [
  '幻',
  '夢',
  '結',
]
const awardColor = {
  幻: 'purple',
  夢: 'red',
  結: 'blue',
} as { [key: string]: string }
const clicked = ref(false)

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

function linear() {
  easing.value = 'linear'
}

function easeOut() {
  easing.value = 'cubic-bezier(0.16, 1, 0.3, 1)'
}

async function startRoll(cls: number) {
  clicked.value = true
  setMotionBlur()
  // linear()
  await wait(5)
  time.value = 0
  currentIndex.value = 0
  // await wait(10)
  const cb = async () => {
    if (currentIndex.value <= 300) {
      console.log('start')
      time.value = 5
      currentIndex.value += 300
    }
    else {
      console.log('end')
      time.value = 0
      currentIndex.value = 0
      await cb()
    }
  }
  // cb()
  // interval = setInterval(cb, 5 * 1000)
  // await wait(5 * 1000)
  stop(cls)
}
const defaultAnimationTime = 10

async function stopRoll(target: number) {
  easeOut()
  time.value = 0
  currentIndex.value = 0
  await wait(10)
  time.value = defaultAnimationTime
  currentIndex.value = target
  return wait(defaultAnimationTime * 1000)
}

async function stop(cls: number) {
  let target = 0
  do
    target = (Math.random() * 500) + 495
    // console.log(currentIndex.value)
  while ((target % 1 <= 0.55) && (target % 1 >= 0.45))
  await stopRoll(target)
  const lotteried = Math.round(target + 3)
  const data = document.querySelector(`[data-index="${lotteried}"]`) as HTMLElement
  diceComplete(data, cls)
}

async function diceComplete(data: any, cls: number) {
  console.log('callback', data, clsNames[cls])
  await wait(500)
  time.value = 0
  showLine.value = false
  showList.value = false
  targetNickname.value = data.dataset.nickname
  targetQqNumber.value = data.dataset.qqnumber
  targetAward.value = clsNames[cls]
  currentIndex.value = 0
  await wait(50)
  cardScale.value = 2
  await wait(500)
  showAward.value = true
}

let blurFilter: SVGElement | null = null

onMounted(() => {
  blurFilter = document.querySelector('#blur > feGaussianBlur') // the feGaussianBlur primitive
  console.log(blurFilter)
})

function setMotionBlur() {
  // the element we want to apply the effect
  const $element = $('.svg-motion-blur')
  // storing the last position, to be able to measure changes
  let lastPos = $element.offset()
  // a multiplier, to be able to control the intensity of the effect
  const multiplier = 0.25

  // a helper to simplify setting the blur.
  function setBlur(x: number, y: number) {
    blurFilter!.setAttribute('stdDeviation', `${x},${y}`)
  }

  (function updateMotionBlur() {
    // get the current position of the element
    const currentPos = $element.offset()

    // calculate the changes from the last frame and apply the multiplier
    const xDiff = Math.abs((currentPos?.left || 0) - lastPos!.left) * multiplier
    const yDiff = Math.abs((currentPos?.top || 0) - lastPos!.top) * multiplier

    // set the blur
    setBlur(xDiff, yDiff)

    // store current position for the next frame
    lastPos = currentPos

    // call to update in the next frame
    requestAnimationFrame(updateMotionBlur)
  })()
}
function reloadPage() {
  window.location.reload()
}
</script>

<template>
  <div class="flex justify-center">
    <div class="fixed z-0">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="filters">
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0,0" />
          </filter>
        </defs>
      </svg>
    </div>
    <div class="bgog h-screen w-screen fixed" />
    <div v-if="loaded" class="w-[90vw] h-screen overflow-x-hidden">
      <div v-if="!clicked" class="fixed flex m-2 z-50 w-[90vw] mt-5">
        <button class="bg-purple-500 shadow-md rounded-md text-purple-100 px-5 py-1 mx-3" type="button" @click="startRoll(0)">
          幻
        </button>
        <button class="bg-red-500 shadow-md rounded-md text-red-100 px-5 py-1 mx-3" type="button" @click="startRoll(1)">
          夢
        </button>
        <button class="bg-blue-500 shadow-md rounded-md text-blue-100 px-5 py-1 mx-3" type="button" @click="startRoll(2)">
          結
        </button>
      </div>
      <div v-else class="fixed flex m-2 z-50 w-[90vw] mt-5">
        <button class="bg-green-500 shadow-md rounded-md text-green-100 px-5 py-1 mx-3" type="button" @click="reloadPage">
          重新开始
        </button>
      </div>
      <div class="fixed m-auto w-[90vw] h-48 left-0 right-0 bottom-0 top-0 flex items-center justify-center z-40">
        <!-- <div class="h-40 w-40 z-50 gl" /> -->
        <div v-show="showLine" class="h-40 w-[3px] bg-yellow-300 m-auto shadow-yellow-600 shadow-md z-50" />
        <!-- <div class="h-40 w-40 z-50 gr" /> -->
      </div>

      <div class="h-full w-full">
        <div :class="{ 'justify-center': !showList }" class="flex items-center shrink-0 h-full w-full" :style="`transition: all ${time}s ${easing};transform: translateX(-${currentIndex * 20}%)`">
          <template v-if="showList">
            <div v-for="(item) in 1000" :key="item" class="svg-motion-blur ibg mx-1 flex flex-col h-40 rounded-lg items-center justify-center w-[calc(20%-0.5rem)] shrink-0 shadow-md overflow-hidden">
              <img :src="`https://q1.qlogo.cn/g?b=qq&nk=${tripleList[item % tripleList.length]?.qqNumber}&s=640`" class="mt-auto rounded-full size-24 drop-shadow-md">
              <span class="text-white drop-shadow-md mt-1 mb-auto text-lg font-semibold max-w-32 truncate" :data-index="item" :data-nickname="tripleList[item % tripleList.length]?.nickname" :data-qqNumber="tripleList[item % tripleList.length]?.qqNumber">{{ tripleList[item % tripleList.length].nickname }}</span>
            </div>
          </template>
          <div v-else :style="`transform: scale(${cardScale})`" class="scale m-auto z-50 ibg mx-1 flex h-40 rounded-lg items-center justify-center w-[calc(20%-0.5rem)] shrink-0 shadow-md overflow-hidden">
            <div :class="{ 'flex-col': !showAward, 'gap-6': showAward }" class="scale flex justify-center items-center">
              <img :src="`https://q1.qlogo.cn/g?b=qq&nk=${targetQqNumber}&s=640`" class="scale mt-auto rounded-full size-24 drop-shadow-md">
              <div class="flex flex-col">
                <span class="scale text-white drop-shadow-md mt-1 mb-auto text-lg font-semibold truncate max-w-32 ">{{ targetNickname }}</span>
                <span v-if="showAward" class="scale text-white drop-shadow-md mt-1 mb-auto font-light">{{ targetQqNumber }}</span>
                <div v-if="showAward" :class="[`bg-${awardColor[targetAward]}-500`, `text-${awardColor[targetAward]}-100`]" class="flex items-center justify-center size-8 mr-auto rounded-full scale drop-shadow-md mt-1 mb-auto text-lg font-semibold">
                  <span>{{ targetAward }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center m-auto h-screen font-bold text-2xl text-white">
      少女祈祷中...
    </div>
  </div>
</template>

<style scoped>
.gl {
    --tw-gradient-from: rgb(209 213 219 / 1);
    --tw-gradient-to: rgb(209 213 219 / 0);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
.gr {
    --tw-gradient-from: rgb(209 213 219 / 1);
    --tw-gradient-to: rgb(209 213 219 / 0);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    background-image: linear-gradient(to left, var(--tw-gradient-stops));
}
.bgog {
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center;
  filter: brightness(0.5);
}
.ibg {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}
.svg-motion-blur{
	-webkit-filter: url("#blur");
	filter: url("#blur");
}
.scale {
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
