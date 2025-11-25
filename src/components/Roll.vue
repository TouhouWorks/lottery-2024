<script setup lang="ts">
import { computedAsync } from '@vueuse/core'
import _ from 'lodash'
import {
  computed,
  onMounted,
  ref,
} from 'vue'
import wait from 'wait'

import qqData from './data.json'

const listUrl = '/api/getLotteries'
const currentIndex = ref(0)
const time = ref(0)
const easing = ref('cubic-bezier(0.16, 1, 0.3, 1)')
const showList = ref(true)
const targetNickname = ref('')
const targetQqNumber = ref('')
const cardScale = ref(1)
const showAward = ref(false)
const showLine = ref(false)
const blurFilter = ref(null as SVGElement | null)
const clicked = ref(false)
const defaultAnimationTime = 10
const cls = ref(0)
const clsNames = [
  '幻',
  '夢',
  '結',
]
const music = [
  new Audio('th07_16_climax.mp3'),
  new Audio('th08_09_climax.mp3'),
  new Audio('th06_05_climax.mp3'),
]
const awardColor = {
  幻: 'purple',
  夢: 'red',
  結: 'blue',
} as { [key: string]: string }

const targetAward = computed(() => {
  return clsNames[cls.value]
})

const audio = computed(() =>
  music[cls.value],
)

const list = computedAsync(async () => {
  // const res = await fetch(listUrl)
  // const data: {
  //   qqNumber: string
  //   nickname: string
  //   time: number
  // }[] = await res.json()
  const data: {
    qqNumber: string
    nickname: string
    time: number
  }[] = qqData.map(item => ({
    qqNumber: item.uin.toString(),
    nickname: item.nick,
    time: Date.now(),
  }))
  return data
})

const tripleList = computed(() => {
  const shuffled = _.shuffle(list.value)
  return shuffled.concat(shuffled.concat(shuffled))
})
const loadedCount = ref(0)
const audioReady = computed(() => {
  return loadedCount.value >= 4
})
const loaded = computed(() => {
  return (list?.value?.length || 0) > 0 && audioReady.value
})

function easeOut() {
  easing.value = 'cubic-bezier(0.16, 1, 0.3, 1)'
}

const sound = new Audio('/rouling.mp3')

async function startRoll(n: number) {
  sound.play()
  cls.value = n
  clicked.value = true
  setMotionBlur()
  await wait(5)
  time.value = 0
  currentIndex.value = 0
  stop()
}
const pray = ref(false)

async function stopRoll(target: number) {
  pray.value = true
  easeOut()
  time.value = 0
  currentIndex.value = 0
  await wait(10)
  time.value = defaultAnimationTime
  currentIndex.value = target
  console.log('stopping at', target)
  return wait(defaultAnimationTime * 1000)
}

const fetchingRandom = ref(false)
async function randomGen(): Promise<number> {
  fetchingRandom.value = true
  const api = `https://www.random.org/integers/?num=1&min=4950&max=9959&col=1&base=10&format=plain&rnd=new`
  const randomNumber = await fetch(api).then(r => r.text()).then(t => t.trim()).catch(() => {
    console.warn('random.org 获取随机数失败，使用 Math.random() 作为后备')
    fetchingRandom.value = false
    return String(Math.floor(Math.random() * 100000) + 1)
  })
  const rndStr = `${randomNumber.substring(0, 3)}.${randomNumber.substring(3)}`
  const rnd = Number.parseFloat(rndStr)
  console.log(`rndStr: ${rndStr}`)
  return rnd
}
async function stop() {
  const target = await randomGen()
  // const rnd = Math.random()
  // do {
  //   const rnd = await randomGen()
  //   target = (rnd * 500) + 495
  // }
  // while ((target % 1 <= 0.55) && (target % 1 >= 0.45))
  fetchingRandom.value = false
  showLine.value = true
  await stopRoll(target)
  const lotteried = Math.round(target + 3)
  const data = document.querySelector(`[data-index="${lotteried}"]`) as HTMLElement
  console.log({
    lotteried,
    data: {
      nickname: data.dataset.nickname,
      qqNumber: data.dataset.qqnumber,
      index: data.dataset.index,
    },
  })
  diceComplete(data)
}

async function diceComplete(data: any) {
  pray.value = false
  await wait(500)
  time.value = 0
  showLine.value = false
  showList.value = false
  targetNickname.value = data.dataset.nickname
  targetQqNumber.value = data.dataset.qqnumber
  currentIndex.value = 0
  playAudio()
  await wait(50)
  cardScale.value = 2
  await wait(500)
  showAward.value = true
}

function playAudio() {
  audio.value.play()
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  }
  else {
    if (document.exitFullscreen)
      document.exitFullscreen()
  }
}

function setMotionBlur() {
  // the element we want to apply the effect
  const $element = $('.svg-motion-blur')
  // storing the last position, to be able to measure changes
  let lastPos = $element.offset()
  // a multiplier, to be able to control the intensity of the effect
  const multiplier = 0.25

  // a helper to simplify setting the blur.
  function setBlur(x: number, y: number) {
    blurFilter.value!.setAttribute('stdDeviation', `${x},${y}`)
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
  if (!audio?.value?.paused) {
    audio.value.pause()
    audio.value.currentTime = 0
  }
  currentIndex.value = 0
  time.value = 0
  easing.value = 'cubic-bezier(0.16, 1, 0.3, 1)'
  showList.value = true
  targetNickname.value = ''
  targetQqNumber.value = ''
  cardScale.value = 1
  showAward.value = false
  showLine.value = false
  clicked.value = false
}

const dotCount = ref(0)
setInterval(() => {
  dotCount.value = (dotCount.value + 1) % 4
}, 150)

function isFirefox() {
  return navigator.userAgent.includes('Firefox')
}
function loadAssets() {
  sound.load()
  sound.oncanplaythrough = () => {
    console.log('sound can playthrough')
    loadedCount.value++
  }
  music.forEach((item) => {
    item.load()
    item.oncanplaythrough = () => {
      console.log(`${item.src} can playthrough`)
      loadedCount.value++
    }
  })
}
onMounted(() => {
  // if (!isFirefox())
  // alert('请使用火狐浏览器打开本页面，否则可能会出现严重的渲染问题')

  blurFilter.value = document.querySelector('#blur > feGaussianBlur') // the feGaussianBlur primitive
  console.log(blurFilter.value)
  loadAssets()
})
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
    <div class="bgog h-screen w-screen fixed">
      <div v-if="pray" class="h-screen w-screen flex items-end justify-end text-white z-50">
        <div class="mx-16 my-8 flex items-start w-48 drop-shadow-md font-semibold text-2xl">
          少女祈祷中{{ '.'.repeat(dotCount) }}
        </div>
      </div>
    </div>
    <div v-if="loaded" class="w-full lg:mx-16 mx-4 h-screen overflow-x-hidden">
      <button
        class="fixed mt-5 top-0 right-4 lg:right-24 m-2 z-50 bg-gray-500 shadow-md rounded-md text-gray-100 px-5 py-1"
        type="button" @click="toggleFullScreen"
      >
        全屏
      </button>
      <div v-if="!clicked" class="fixed flex m-2 z-50 mt-5">
        <button
          class="bg-purple-500 shadow-md rounded-md text-purple-100 px-5 py-1 mx-3" type="button"
          @click="startRoll(0)"
        >
          幻
        </button>
        <button class="bg-red-500 shadow-md rounded-md text-red-100 px-5 py-1 mx-3" type="button" @click="startRoll(1)">
          夢
        </button>
        <button
          class="bg-blue-500 shadow-md rounded-md text-blue-100 px-5 py-1 mx-3" type="button"
          @click="startRoll(2)"
        >
          結
        </button>
      </div>
      <div v-else class="fixed flex m-2 z-50 mt-5">
        <button
          v-show="!fetchingRandom" class="bg-green-500 shadow-md rounded-md text-green-100 px-5 py-1 mx-3"
          type="button" @click="reloadPage"
        >
          重新开始
        </button>
        <span v-if="fetchingRandom" class="text-white px-5 py-1 mx-3">
          正在获取随机数...
        </span>
      </div>
      <div class="fixed m-auto w-[90vw] h-48 left-0 right-0 bottom-0 top-0 flex items-center justify-center z-40">
        <!-- <div class="h-40 w-40 z-50 gl" /> -->
        <!-- <div
          v-show="showLine"
          :class="{
            // bg-yellow-300 m-auto shadow-yellow-600
            'bg-purple-500 m-auto shadow-purple-700': showLine && cls === 0,
            'bg-red-500 m-auto shadow-red-700': showLine && cls === 1,
            'bg-blue-500 m-auto shadow-blue-700': showLine && cls === 2,
          }"
          class="h-40 w-[3px]  shadow-md z-50"
        /> -->
        <div v-show="showLine" class="h-48 w-[3px] bg-yellow-300 m-auto shadow-yellow-600 shadow-md z-50" />
        <!-- <div class="h-40 w-40 z-50 gr" /> -->
      </div>

      <div class="h-full w-full">
        <div
          :class="{ 'justify-center': !showList }" class="flex gap-2 items-center shrink-0 h-full w-full"
          :style="`transition: all ${time}s ${easing};transform: translateX(-${currentIndex * 20}%)`"
        >
          <template v-if="showList">
            <div
              v-for="(item) in 1000" :key="item"
              class="svg-motion-blur ibg flex flex-col gap-3 h-48 rounded-lg items-center justify-between w-[calc(20%-0.5rem)] shrink-0 shadow-md overflow-hidden"
            >
              <img
                :src="`https://q1.qlogo.cn/g?b=qq&nk=${tripleList[item % tripleList.length]?.qqNumber}&s=640`"
                class="mt-auto rounded-full size-24 drop-shadow-md"
              >
              <span
                class="text-white drop-shadow-md mt-1 mb-auto text-lg font-semibold max-w-64 truncate"
                :data-index="item" :data-nickname="tripleList[item % tripleList.length]?.nickname"
                :data-qqNumber="tripleList[item % tripleList.length]?.qqNumber"
                v-html="tripleList[item % tripleList.length].nickname"
              />
            </div>
          </template>
          <div
            v-else :style="`transform: scale(${cardScale})`"
            class="scale z-50 ibg mx-1 flex h-fit rounded-lg items-center justify-center w-fit shrink-0 shadow-md overflow-hidden"
          >
            <div :class="{ 'flex-col items-center': !showAward, 'gap-6': showAward }" class="flex w-full p-8">
              <img
                :src="`https://q1.qlogo.cn/g?b=qq&nk=${targetQqNumber}&s=640`"
                class="mt-auto rounded size-24 drop-shadow-md"
              >
              <div class="flex flex-col justify-between mb-1">
                <div class="flex flex-col">
                  <span
                    class="text-white drop-shadow-md text-xl font-semibold truncate max-w-64"
                    :class="{
                      'min-w-32': showAward,
                    }"
                    v-html="targetNickname"
                  />
                  <span v-if="showAward" class="scale text-white drop-shadow-md font-light">{{ targetQqNumber }}</span>
                </div>
                <div
                  v-if="showAward" :class="[`bg-${awardColor[targetAward]}-500`]"
                  class="flex items-center justify-center size-7 mr-auto rounded scale drop-shadow-md text-lg font-semibold text-white"
                >
                  <span>{{ targetAward }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center m-auto h-screen font-bold text-2xl text-white z-50">
      <div class="w-40 flex items-start">
        少女祈祷中{{ '.'.repeat(dotCount) }}
      </div>
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
  filter: brightness(0.8);
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
