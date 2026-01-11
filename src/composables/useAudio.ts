import { computed, ref } from 'vue'
import { CLASS_NAMES, MUSIC_FILES } from '../components/constants'

export function useAudio() {
  const cls = ref(0)
  const loadedCount = ref(0)

  const music = MUSIC_FILES.map(file => new Audio(file))
  const sound = new Audio('/rouling.mp3')

  const targetAward = computed(() => CLASS_NAMES[cls.value])

  const audio = computed(() => music[cls.value])

  const audioReady = computed(() => loadedCount.value >= 4)

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

  function playAudio() {
    audio.value.play()
  }

  function playSound() {
    sound.play()
  }

  function stopAudio() {
    if (!audio?.value?.paused) {
      audio.value.pause()
      audio.value.currentTime = 0
    }
  }

  return {
    cls,
    targetAward,
    audio,
    audioReady,
    loadedCount,
    loadAssets,
    playAudio,
    playSound,
    stopAudio,
  }
}
