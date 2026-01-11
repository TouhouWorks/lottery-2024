export function isDisplayable(str: string): boolean {
  if (typeof str !== 'string' || str.length === 0)
    return false

  let visible = false

  for (const ch of str) {
    const code = ch.codePointAt(0)
    if (code === undefined)
      return false

    // 控制符(C0 / C1 控制区)
    if ((code >= 0 && code <= 0x1F) || (code >= 0x7F && code <= 0x9F)) {
      return false
    }

    // invisible characters
    if (
      (code >= 0x00AD && code <= 0x00AD) // 软连字符
      || (code >= 0x034F && code <= 0x034F) // 组合用反格式化空格
      || (code >= 0x061C && code <= 0x061C) // 阿拉伯语字母标记
      || (code >= 0x115F && code <= 0x1160) // 盲文点字模式标记
      || (code >= 0x17B4 && code <= 0x17B5) // 柬埔寨语元音格式化符
      || (code >= 0x180B && code <= 0x180D) // 蒙古语变音符
      || (code >= 0x200E && code <= 0x200F) // 左到右标记 / 右到左标记
      || (code >= 0x2028 && code <= 0x2029) // 行分隔符 / 段分隔符
      || (code >= 0x2060 && code <= 0x2064) // 单词连接符等
      || (code >= 0x206A && code <= 0x206F) // 字符隔离符等
      || (code >= 0xFE00 && code <= 0xFE0F) // 变体选择符
      || (code >= 0xFFF0 && code <= 0xFFF8) // 非字符
      || (code >= 0xFFF9 && code <= 0xFFFB) // 替换字符等
      || (code >= 0xE0000 && code <= 0xE0FFF)
    ) {
      return false
    }

    // Unicode 私用区(PUA)
    if (
      (code >= 0xE000 && code <= 0xF8FF)
      || (code >= 0xF0000 && code <= 0x10FFFF)
    ) {
      return false
    }

    // 未分配或代理区(保留区)
    if (code >= 0xD800 && code <= 0xDFFF) {
      return false
    }

    // 零宽、格式化符号(ZWNJ, ZWJ, BOM 等)
    if (
      [
        0x200B,
        0x200C,
        0x200D,
        0xFEFF,
        0x2060,
        0x202A,
        0x202B,
        0x202C,
        0x202D,
        0x202E,
      ].includes(code)
    ) {
      return false
    }

    // 标记是否含有可见字符(非空白)
    if (!/\s/.test(ch))
      visible = true
  }

  return visible
}

export function processNickname(nickname: string): string {
  const processedName = nickname.replaceAll(/\s+/g, '')
  if (!isDisplayable(processedName)) {
    return '神秘人'
  }
  return processedName
}
