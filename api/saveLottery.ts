import { kv } from '@vercel/kv'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST')
    return response.status(405).json({ error: 'Method Not Allowed' })

  const ticketId = request.body.ticketId as string
  const qqNumber = request.body.qqNumber as string
  const nickname = request.body.nickname as string
  const ticket = await kv.get(`ticket:${ticketId}`)
  if (!ticket)
    return response.status(404).json({ error: 'TICKET_NOT_FOUND' })

  if (!qqNumber)
    return response.status(400).json({ error: '请输入 QQ 号' })

  if (!nickname)
    return response.status(400).json({ error: '请输入昵称' })

  if (nickname.length > 16)
    return response.status(400).json({ error: '昵称长度不能超过 16 个字符' })

  // return response.status(200).json({ success: true });
  await kv.set(`lottery:${ticketId}`, {
    qqNumber,
    nickname,
    time: Date.now(),
  })
  return response.status(200).json({ success: true })
}
