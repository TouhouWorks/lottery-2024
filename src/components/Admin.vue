<script setup lang="ts">
import { computedAsync, toRefs, useDebounce, useScroll, useStorage, watchDebounced } from '@vueuse/core'
import { computed, h, nextTick, onMounted, ref, watch } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

const jwtSession = useStorage('jwtSession', '')
const code = ref('')
async function login() {
  const res = await fetch('/api/Login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      otpCode: code.value,
    }),
  })
  if (res.status === 200) {
    const data = await res.json()
    jwtSession.value = data.jwtToken
  }

  else { alert('登录失败') }
}
async function generateHash(str: string): Promise<string> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then((hash) => {
    const hashArray = Array.from(new Uint8Array(hash))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex.substring(0, 32)
  })
}
const qrCodeContent = ref('')
const qrCode = useQRCode(qrCodeContent)
const needDisplay = ref(false)

const defaultCountDown = 600
const countDown = ref(defaultCountDown)
const ticketId = ref('')

function countdownTimer() {
  countDown.value = defaultCountDown
  const timer = setInterval(() => {
    console.log(countDown.value)
    countDown.value--
  }, 1000)
  return timer
}
let timer = null

watch(needDisplay, (value) => {
  console.log(value)
  if (value) { timer = countdownTimer() }

  else {
    console.log('clear timer')
    clearInterval(timer)
  }
})

watch(countDown, (value) => {
  if (value === 0)
    needDisplay.value = false
})
async function registerQRCode() {
  const random = Math.floor(Math.random() * 1000000)
  ticketId.value = await generateHash(random.toString())
  const otpCode = prompt('请输入 2FA 验证码')
  if (!otpCode)
    return

  needDisplay.value = false
  const res = await fetch(`/api/signTicket?ticketId=${ticketId.value}&otpCode=${otpCode}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwtSession.value}`,
    },
  })

  const data = await res.json()
  if (res.status === 200) {
    needDisplay.value = true
    qrCodeContent.value = `https://lottery-2024.touhou.works/#/ticket/${ticketId.value}`
  }
  else { alert(`生成失败: ${data.error}`) }
}
</script>

<template>
  <div class="flex flex-col">
    <div v-if="jwtSession">
      <h1
        class="text-2xl font-light text-center mt-4"
      >
        欢迎回来
      </h1>
      <div class="flex flex-col items-center mt-2">
        <button
          class="w-72 px-4 py-2 mt-2 text-white bg-purple-500 rounded-md"
          @click="registerQRCode"
        >
          生成 「幻夢結社」 抽奖登记二维码
        </button>
        <div class="flex flex-col items-center mt-2">
          <img
            v-if="needDisplay"
            :src="qrCode"
            class="w-64 h-64"
          >
          <div v-if="needDisplay" class="flex flex-col items-center mt-2">
            <p>二维码有效期 <span class="text-red-500">{{ countDown }}</span> 秒</p>
            <p>票据 ID: <code class="text-gray-400">{{ ticketId }}</code></p>
          </div>
          <p v-else>
            请点击按钮生成二维码
          </p>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col">
      <h1
        class="text-2xl font-light text-center mt-4"
      >
        请输入 2FA 验证码
      </h1>
      <div class="flex flex-col items-center mt-2">
        <input
          v-model="code"
          class="w-64 px-4 py-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="2FA 验证码"
        >
        <button
          class="w-64 px-4 py-2 mt-2 text-white bg-purple-500 rounded-md"
          @click="login"
        >
          登录
        </button>
      </div>
    </div>
  </div>
</template>
