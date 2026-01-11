<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import wait from 'wait'
import { useAudio } from '../composables/useAudio'
import { useCheckInData } from '../composables/useCheckInData'
import { useLotteryAnimation } from '../composables/useLotteryAnimation'
import { useMotionBlur } from '../composables/useMotionBlur'
import ControlButtons from './ControlButtons.vue'
import LotteryCard from './LotteryCard.vue'
import ResultCard from './ResultCard.vue'

// 数据加载
const { loadCheckInData, tripleList, list } = useCheckInData()

// 动画控制
const {
  currentIndex,
  time,
  easing,
  showList,
  showLine,
  pray,
  clicked,
  fetchingRandom,
  rollTo,
  randomGen,
  reset: resetAnimation,
} = useLotteryAnimation()

// 音频管理
const {
  cls,
  targetAward,
  audioReady,
  loadAssets,
  playAudio,
  playSound,
  stopAudio,
} = useAudio()

// 动态模糊
const { setMotionBlur } = useMotionBlur()

// 结果显示
const targetNickname = ref('')
const targetUid = ref('')
const targetAvatar = ref('')
const cardScale = ref(1)
const showAward = ref(false)

// 加载状态
const loaded = computed(() => {
  return (list?.value?.length || 0) > 0 && audioReady.value
})

// 点数动画
const dotCount = ref(0)
setInterval(() => {
  dotCount.value = (dotCount.value + 1) % 4
}, 150)

// 开始抽奖
async function startRoll(n: number) {
  playSound()
  cls.value = n
  clicked.value = true
  setMotionBlur()
  await wait(5)
  time.value = 0
  currentIndex.value = 0
  startDice()
}

// 执行抽奖
async function startDice() {
  const target = await randomGen()
  fetchingRandom.value = false
  showLine.value = true

  const lotteried = Math.round(target + 3)
  const data = document.querySelector(`[data-index="${lotteried}"]`) as HTMLElement
  console.log({
    lotteried,
    data: {
      nickname: data.dataset.nickname,
      uid: data.dataset.uid,
      index: data.dataset.index,
    },
  })

  await rollTo(target)

  diceComplete(data)
}

// 抽奖完成
async function diceComplete(data: any) {
  pray.value = false
  await wait(500)
  time.value = 0
  showLine.value = false
  showList.value = false
  targetNickname.value = data.dataset.nickname
  targetUid.value = data.dataset.uid
  targetAvatar.value = data.dataset.avatar || ''
  currentIndex.value = 0
  playAudio()
  await wait(50)
  cardScale.value = 2
  await wait(500)

  showAward.value = true
}

// 重新开始
function reloadPage() {
  stopAudio()
  resetAnimation()
  targetNickname.value = ''
  targetUid.value = ''
  targetAvatar.value = ''
  cardScale.value = 1
  showAward.value = false
}

// 全屏切换
const { f } = useMagicKeys()
watch(f, () => {
  toggleFullScreen()
})

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  }
  else {
    if (document.exitFullscreen)
      document.exitFullscreen()
  }
}

// 初始化
onMounted(() => {
  loadCheckInData()
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
    <div v-if="loaded" class="w-full lg:mx-16 mx-4 overflow-x-hidden">
      <button
        class="fixed mt-5 top-0 right-4 lg:right-24 m-2 z-50 bg-gray-500 shadow-md rounded-md text-gray-100 px-5 py-1"
        type="button" @click="toggleFullScreen"
      >
        全屏 (F)
      </button>
      <ControlButtons
        :clicked="clicked"
        :fetching-random="fetchingRandom"
        @start-roll="startRoll"
        @reload="reloadPage"
      />
      <div class="flex flex-col h-screen w-full items-center justify-center">
        <div class="relative w-full overflow-x-hidden h-[32rem] flex items-center">
          <div
            v-if="showLine"
            class="absolute m-auto w-[90vw] h-48 left-0 right-0 bottom-0 top-0 flex items-center justify-center z-40"
          >
            <div class="h-48 w-[3px] bg-yellow-300 m-auto shadow-yellow-600 shadow-md z-50" />
          </div>
          <div
            :class="{ 'justify-center': !showList }" class="flex gap-2 items-center shrink-0 w-full"
            :style="`transition: all ${time}s ${easing};transform: translateX(-${currentIndex * 20}%)`"
          >
            <template v-if="showList">
              <LotteryCard
                v-for="item in 1000"
                :key="item"
                :user="tripleList?.[item % tripleList.length]"
                :index="item"
              />
            </template>

            <ResultCard
              v-else
              :nickname="targetNickname"
              :uid="targetUid"
              :avatar="targetAvatar"
              :award="targetAward"
              :scale="cardScale"
              :show-award="showAward"
            />
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
  background-image: url('https://cdn.sa.net/2026/01/09/w9hOf7TegaRrpcU.jpg');
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
