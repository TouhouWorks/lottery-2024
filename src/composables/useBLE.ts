import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

const hidConnected = ref(false)
const lastDeviceName = useStorage('last-hid-device-name', '')

export interface KeyMapping {
  [key: number]: () => void
}
async function setupHIDConnection(onInput: KeyMapping = {}) {
  let devices = await navigator?.hid.getDevices()
  if (devices.length === 0) {
    devices = await navigator.hid.requestDevice({
      filters: [],
    })
  }

  const device = devices[0]
  if (device.opened) {
    console.log('HID 设备已连接:', device.productName)
    return
  }

  console.log('请求的 HID 设备:', device)
  await device.open()

  hidConnected.value = device.opened
  lastDeviceName.value = device.productName

  navigator.hid.addEventListener('disconnect', ({ device }) => {
    console.log(`HID 设备已断开连接: ${device.productName}`)
    hidConnected.value = false
  })
  device.oninputreport = (e) => {
    const { data, reportId } = e
    console.log(`Received input report ${reportId} with data:`, data)

    const bytes = Array.from(new Uint8Array(data.buffer))

    console.log('HID Input Report Bytes:', bytes)

    const controlCode = bytes[0]
    if (onInput[controlCode]) {
      onInput[controlCode]()
    }
    // switch (bytes[0]) {
    // case 16: {
    //   // Up
    //   loadPrevLyricFile()
    //   break
    // }
    // case 32: {
    //   // Down
    //   loadNextLyricFile()
    //   break
    // }
    // case 4: {
    //   // Play/Pause
    //   tryPlayLyric()
    //   break
    // }
    // case 1: {
    //   // Volume Up
    //   // seek forward 5 seconds
    //   seekLyricPosition(5)
    //   break
    // }
    // case 2: {
    //   // Volume Down
    //   // seek backward 5 seconds
    //   seekLyricPosition(-5)
    //   break
    // }
    // }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      device.close()
    }
    else {
      device.open()
    }
  })
}

export function useBLE() {
  return {
    hidConnected,
    lastDeviceName,
    setupHIDConnection,
  }
}
