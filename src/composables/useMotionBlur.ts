import { onMounted, ref } from 'vue'

export function useMotionBlur() {
  const blurFilter = ref<SVGElement | null>(null)

  onMounted(() => {
    blurFilter.value = document.querySelector('#blur > feGaussianBlur')
    console.log(blurFilter.value)
  })

  function setMotionBlur() {
    const $element = $('.svg-motion-blur')
    let lastPos = $element.offset()
    const multiplier = 0.25

    function setBlur(x: number, y: number) {
      blurFilter.value!.setAttribute('stdDeviation', `${x},${y}`)
    }

    (function updateMotionBlur() {
      const currentPos = $element.offset()

      const xDiff = Math.abs((currentPos?.left || 0) - lastPos!.left) * multiplier
      const yDiff = Math.abs((currentPos?.top || 0) - lastPos!.top) * multiplier

      setBlur(xDiff, yDiff)

      lastPos = currentPos

      requestAnimationFrame(updateMotionBlur)
    })()
  }

  return {
    blurFilter,
    setMotionBlur,
  }
}
