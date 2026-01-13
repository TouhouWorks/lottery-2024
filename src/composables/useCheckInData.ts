import type { CheckInDataItem, LotteryUser } from '../components/types'
import _ from 'lodash'
import { computed, ref } from 'vue'
import { CHECKIN_API_TOKEN, CHECKIN_API_URL } from '../components/constants'
import { processNickname } from '../components/utils'

const gistHash = new URLSearchParams(window.location.search).get('hash') || ''
export function useCheckInData() {
  const checkInData = ref<CheckInDataItem[]>([])

  async function loadCheckInData() {
    const staticCSVFile = `https://gist.shizuku.sh/${gistHash}/extraList.csv?t=${Date.now()}`

    const res = await fetch(CHECKIN_API_URL, {
      headers: {
        Authorization: `Bearer ${CHECKIN_API_TOKEN}`,
      },
    })
    const thmkData = await res.json().then(r => r.map((item: any) => {
      if (!item.value.user_name) {
        item.value.user_name = `叮铃铃用户# ${item.value.user_id}`
      }
      item.value.type = 'thmk'
      return item.value
    })).catch(() => [])
    if (!gistHash) {
      checkInData.value = thmkData
      return
    }
    const qqData = await fetch(staticCSVFile).then(res => res.text()).then((text) => {
      const lines = text.split('\n')
      const data: CheckInDataItem[] = []
      for (const line of lines) {
        const [uid, nickname, avatar] = line.split(',')
        if (uid && nickname) {
          data.push({
            user_id: Number(uid),
            user_name: nickname,
            user_avatar: avatar || '',
            ticket_id: 0,
            event_id: 0,
            order_id: 0,
            type: 'qq',
          })
        }
      }
      return data
    }).catch(() => [])
    checkInData.value = [...thmkData, ...qqData]
  }

  const list = computed(() => {
    const data: LotteryUser[] = checkInData.value.map(item => ({
      uid: item.user_id.toString(),
      avatar: item.user_avatar,
      nickname: processNickname(item.user_name),
      time: Date.now(),
      type: item.type,
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
