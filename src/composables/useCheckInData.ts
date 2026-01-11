import type { CheckInDataItem, LotteryUser } from '../components/types'
import _ from 'lodash'
import { computed, ref } from 'vue'
import { CHECKIN_API_TOKEN, CHECKIN_API_URL } from '../components/constants'
import { processNickname } from '../components/utils'

export function useCheckInData() {
  const checkInData = ref<CheckInDataItem[]>([])

  async function loadCheckInData() {
    const res = await fetch(CHECKIN_API_URL, {
      headers: {
        Authorization: `Bearer ${CHECKIN_API_TOKEN}`,
      },
    })
    const data = await res.json().then(r => r.map((item: any) => {
      if (!item.value.user_name) {
        item.value.user_name = `叮铃铃用户# ${item.value.user_id}`
      }
      return item.value
    }))
    checkInData.value = data
  }

  const list = computed(() => {
    const data: LotteryUser[] = checkInData.value.map(item => ({
      uid: item.user_id.toString(),
      avatar: item.user_avatar,
      nickname: processNickname(item.user_name),
      time: Date.now(),
    }))
    return data
  })

  const tripleList = computed(() => {
    const shuffled = _.shuffle(list.value)
    const concated = shuffled.concat(shuffled.concat(shuffled))
    // console.log('tripleList', concated)
    return concated
  })

  return {
    checkInData,
    loadCheckInData,
    list,
    tripleList,
  }
}
