<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'

import { useRoute } from 'vue-router'

import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const route = useRoute()
const ticketId = route.params.ticketId as string

function checkBrowserSupport() {
  const ua = navigator.userAgent.toLowerCase()
  const isQQBrowser = ua.includes('MQQBrowser')
  const isWechat = ua.includes('micromessenger')

  return !(isQQBrowser || isWechat)
}
const joinGroupLink = 'https://qm.qq.com/q/o4n2wIlogE'
const name = ref('')
const qqNumberValid = ref(false)
const qqNumber = ref('')
const ticketValid = ref(false)
const ticketError = ref('')
const lotteryJoined = ref(false)
onMounted(async () => {
  if (!checkBrowserSupport())
    console.log('不支持')

  if (!validateTicketId(ticketId))
    console.log('无效的票据')

  const lotteryInfo = await getLotteryInfo(ticketId)
  if (lotteryInfo.error === 'LOTTERY_NOT_FOUND')
    lotteryJoined.value = false
  else
    lotteryJoined.value = true
})

async function getLotteryInfo(ticketId: string) {
  return await fetch(`/api/getLottery?ticketId=${ticketId}`).then(res => res.json())
}
async function validateTicketId(ticketId: string) {
  const result = await fetch(`/api/getTicket?ticketId=${ticketId}`).then(res => res.json())
  if (result.signTime) {
    ticketValid.value = true
  }
  else {
    ticketValid.value = false
    ticketError.value = result.error
  }
}

const joinGroupQRCode = useQRCode(joinGroupLink)
const currentStep = ref(0)
const isFormIncompleted = computed(() => {
  return currentStep.value === 1
    && (!qqNumber.value || !name.value || !qqNumberValid.value)
    || !ticketValid.value || lotteryJoined.value
})
const buttonText = computed(() => {
  switch (currentStep.value) {
    case 0: {
      if (!ticketValid.value) {
        if (!ticketError.value)
          return '验票中...'

        return `验票失败: ${ticketError.value}`
      }
      else if (lotteryJoined.value) {
        return '已参与抽奖'
      }
      else {
        return '下一步'
      }
    }
    case 1: {
      if (isFormIncompleted.value)
        return '少女折寿中...'

      return '提交'
    }
    case 2:
      return '加入QQ群'
    default:
      return '下一步'
  }
})
async function submitForm() {
  console.log(`name: ${name.value}, qqNumber: ${qqNumber.value}`)
  await fetch(`/api/saveLottery`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      ticketId,
      qqNumber: qqNumber.value,
      nickname: name.value,
    }).toString(),
  }).then(res => res.json())
}
watch(currentStep, async (val) => {
  console.log(`currentStep: ${val}`)
  if (val === 2) {
    await submitForm()
    lotteryJoined.value = true
  }
  if (val === 3) {
    currentStep.value = 0
    window.open(joinGroupLink)
  }
}, { immediate: true })
function debounce(fn: { (val: any): void, apply?: any }, delay: number | undefined) {
  let timer: string | number | NodeJS.Timeout | null | undefined = null
  return function (this: any, ...args: any) {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, ...args)
    }, delay)
  }
}
const debounceGetQQNumber = debounce((val: any) => {
  console.log(val)
}, 500)
watch(qqNumber, (val) => {
  debounceGetQQNumber(val)
})
function qqAvatarLoaded(dom: any) {
  const { naturalWidth, naturalHeight } = dom.target
  if (naturalWidth === 40 || naturalHeight === 40)
    qqNumberValid.value = false
  else
    qqNumberValid.value = true
}
</script>

<template>
  <div v-if="currentStep === 0" class="flex flex-col items-center px-8 gap-2 h-[90vh]">
    <h1 class="font-light mt-4 text-[1.5rem]">
      参与高凉年例祭现场抽奖
    </h1>
    <hr class="w-full my-2 border-gray-300">
    <p>
      幻夢結社新年大礼包。南国开曙日，油城复新春。助力首届粤西 THP 顺利举办，幻夢結社特推出贺岁抽奖活动。
    </p>
    <ol class="list-none">
      <li>「<span class="text-purple-500 font-bold">幻</span>」字状元，可兑换五百元大奖及周边礼品。</li>
      <li>「<span class="text-red-400 font-bold">夢</span>」字榜眼，可兑换三百元大奖及周边礼品。</li>
      <li>「<span class="text-blue-400 font-bold">結</span>」字探花，可兑换一百元大奖及周边礼品。</li>
    </ol>
    <p class="font-semibold text-xl text-red-500">
      只要在年例祭现场加入<a
        target="_blank" class="text-blue-500 hover:text-blue-400 px-2"
        :href="joinGroupLink"
      >「幻夢結社」QQ同好群</a>，即有机会参与抽奖
    </p>
    <p>QQ 群号: <code class="text-red-400 font-bold font-mono">483024893</code></p>
    <p>春风送暖，浮生幻梦，相伴有你。祝参加粤西 THP 的各位同好心想事成，万事如意。相见明年。（详细信息可咨询摊位工作人员）</p>
    <p class="text-gray-400 text-xs">
      <code>票据ID: #{{ ticketId }}</code>
    </p>
  </div>

  <div v-if="currentStep === 1" class="flex flex-col items-center px-8 gap-2 h-[90vh]">
    <h1 class="text-[2rem] font-light mt-4">
      参与「幻夢結社」2024 高凉年例祭现场抽奖
    </h1>
    <hr class="w-full my-4 border-gray-300">
    <div class="mt-2 w-full">
      <input
        v-model="name" type="text"
        name="name"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="输入昵称 (大屏展示用)"
      >
      <br>
      <input
        v-model="qqNumber" type="text"
        name="qq"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="输入QQ号"
      >
    </div>
    <img v-if="qqNumber" id="avatar" :src="`https://q1.qlogo.cn/g?b=qq&nk=${qqNumber}&s=640`" class="w-32 h-32 rounded-full mt-12" @load="qqAvatarLoaded">
    <!-- <button type="button" class="mt-auto w-full h-[4rem] rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" @click="currentStep++">提交</button> -->
  </div>

  <div v-if="currentStep === 2" class="flex flex-col items-center px-8 gap-2 h-[85vh]">
    <h1 class="text-[2rem] font-light mt-4">
      参与「幻夢結社」2024 高凉年例祭现场抽奖
    </h1>
    <hr class="w-full my-4 border-gray-300">
    <CheckCircleIcon class="w-16 h-16 text-green-500 mb-4" />
    <p>抽奖信息已提交，如果还未加入QQ群，请点击下方按钮或扫描二维码加入，否则无法参与抽奖</p>
    <img :src="joinGroupQRCode" class="w-32 h-32 mt-12">
  </div>
  <div class="flex flex-col mt-auto px-8 gap-2">
    <button
      type="button"
      class="w-full h-12 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      :disabled="isFormIncompleted && currentStep !== 2" @click="currentStep++"
    >
      {{ buttonText }}
    </button>

    <button
      v-if="currentStep === 2"
      type="button"
      class="w-full h-12 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" @click="currentStep = 0"
    >
      回到首页
    </button>
  </div>
</template>

<style scoped>
.map-page-container {
  width: 100%;
  height: 30%;
}

ol li {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  font-weight: 200;
}
</style>
