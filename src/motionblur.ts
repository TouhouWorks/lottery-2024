export default function () {
  // const minBlur = 2
  // const maxBlur = 200
  let isUpdatingBlur = false
  let updateBlurStopTimeout: any | null = null
  let multiplier = 0.25

  $.fn.toggleBlur = function (v: any) {
    const blurId = $(this).data('blur-id')
    const value = v ? `url(#${blurId})` : 'none'
    $(this).css({
      webkitFilter: value,
      filter: value,
    })
  }
  $.fn.setBlur = function (v: string | number | boolean | symbol | object | null) {
    const blur = $(this).data('blur')
    v = Math.round(v)
    if ($(this).data('blur-value') !== v) {
      if (v === 0) {
        $(this).toggleBlur(false)
      }
      else {
        $(this).toggleBlur(true)

        blur.firstElementChild.setAttribute('stdDeviation', `${v},0`)
        $(this).data('blur-value', v)
      }
    }
  }
  $.fn.initBlur = function (_multiplier: number) {
    if (typeof _multiplier == 'undefined')
      _multiplier = 0.25
    multiplier = _multiplier
    const defs = $('.filters defs').get(0)
    const blur = $('#blur').get(0)
    $(this).each(function (i) {
      const blurClone = blur!.cloneNode(true)
      const blurId = `blur${i}`;
      (blurClone as any).setAttribute('id', blurId)
      defs!.appendChild(blurClone)
      $(this)
        .data('blur', blurClone)
        .data('blur-id', blurId)
        .data('blur-value', 0)
        .data('last-pos', $(this as any).offset())
    })
  }

  $.updateBlur = function () {
    $('.js-blur').each(function () {
      const pos = $(this).offset()
      const lastPos = $(this).data('last-pos')
      const v = Math.abs(pos!.left - lastPos.left) * multiplier
      $(this).data('last-pos', pos)
      ($(this) as any).setBlur(v)
    })
    if (isUpdatingBlur)
      requestAnimationFrame($.updateBlur)
  }
  $.startUpdatingBlur = function (stopDelay: number | undefined) {
    if (typeof stopDelay == 'undefined')
      stopDelay = -1

    if (updateBlurStopTimeout != null) {
      clearTimeout(updateBlurStopTimeout)
      updateBlurStopTimeout = null
    }
    if (!isUpdatingBlur) {
      isUpdatingBlur = true
      $.updateBlur()
    }
    if (stopDelay > -1)
      updateBlurStopTimeout = setTimeout($.stopUpdatingBlur, stopDelay)
  }
  $.stopUpdatingBlur = function () {
    isUpdatingBlur = false
  }
}
