export interface CheckInDataItem {
  user_id: number
  user_name: string
  user_avatar: string
  ticket_id: number
  event_id: number
  order_id: number
  type: UserType
}

export interface LotteryUser {
  uid: string
  nickname: string
  avatar?: string
  time: number
  type: UserType
}

export type UserType = 'thmk' | 'qq'

export type AwardType = '幻' | '夢' | '結'

export type AwardColor = 'purple' | 'red' | 'blue'
