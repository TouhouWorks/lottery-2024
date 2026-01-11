import type { AwardColor, AwardType } from './types'

export const DEFAULT_ANIMATION_TIME = 10

export const CLASS_NAMES: AwardType[] = ['幻', '夢', '結']

export const AWARD_COLORS: Record<AwardType, AwardColor> = {
  幻: 'purple',
  夢: 'red',
  結: 'blue',
}

export const MUSIC_FILES = [
  'th07_16_climax.mp3',
  'th08_09_climax.mp3',
  'th06_05_climax.mp3',
]

export const CHECKIN_API_URL = 'https://shizuku-kv.satori.workers.dev/kv/export/yxtho.json'
export const CHECKIN_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcm9udGVuZCIsInBlcm1pc3Npb25zIjpbeyJuYW1lc3BhY2UiOiJ5eHRobyIsInBlcm1pc3Npb25zIjpbInJlYWQiXX1dLCJpYXQiOjE3NjgxMzQ2NjZ9.UgtP5EgGeMCwqTGe2pwJbTnOeynexYwHLOAd6aoE5ew'
