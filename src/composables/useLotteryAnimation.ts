import { ref } from 'vue'
import wait from 'wait'
import { DEFAULT_ANIMATION_TIME } from '../components/constants'

export function useLotteryAnimation() {
  const currentIndex = ref(0)
  const time = ref(0)
  const easing = ref('cubic-bezier(0.16, 1, 0.3, 1)')
  const showList = ref(true)
  const showLine = ref(false)
  const pray = ref(false)
  const clicked = ref(false)
  const fetchingRandom = ref(false)

  function easeOut() {
    easing.value = 'cubic-bezier(0.16, 1, 0.3, 1)'
  }

  async function rollTo(target: number) {
    pray.value = true
    easeOut()
    time.value = 0
    currentIndex.value = 0
    await wait(10)
    time.value = DEFAULT_ANIMATION_TIME
    currentIndex.value = target
    console.log('stopping at', Math.round(target + 3))
    return wait(DEFAULT_ANIMATION_TIME * 1000)
  }

  // async function randomGen(): Promise<number> {
  //   fetchingRandom.value = true
  //   const api = `https://www.random.org/integers/?num=1&min=4950&max=9959&col=1&base=10&format=plain&rnd=new`
  //   const randomNumber = await fetch(api).then(r => r.text()).then(t => t.trim()).catch(() => {
  //     console.warn('random.org 获取随机数失败，使用 Math.random() 作为后备')
  //     fetchingRandom.value = false
  //     return String(Math.floor(Math.random() * 100000) + 1)
  //   })
  //   const rndStr = `${randomNumber.substring(0, 3)}.${randomNumber.substring(3)}`
  //   const rnd = Number.parseFloat(rndStr)
  //   return rnd
  // }

  async function pRandomGen(): Promise<number> {
    fetchingRandom.value = true
    const rndNumber = String(Math.floor(Math.random() * (9959 - 4950 + 1)) + 4950)
    const rndStr = `${rndNumber.substring(0, 3)}.${rndNumber.substring(3)}`
    const rnd = Number.parseFloat(rndStr)
    fetchingRandom.value = false
    return rnd
  }

  function reset() {
    currentIndex.value = 0
    time.value = 0
    easing.value = 'cubic-bezier(0.16, 1, 0.3, 1)'
    showList.value = true
    showLine.value = false
    clicked.value = false
    pray.value = false
  }

  return {
    currentIndex,
    time,
    easing,
    showList,
    showLine,
    pray,
    clicked,
    fetchingRandom,
    rollTo,
    randomGen: pRandomGen,
    reset,
  }
}
