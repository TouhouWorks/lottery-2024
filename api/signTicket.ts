import { kv } from '@vercel/kv'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { generateSecret, verifyToken } from 'node-2fa'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const authorizationString = request.headers.authorization
  if (!authorizationString)
    return response.status(401).json({ error: 'Unauthorized' })

  const authorization = authorizationString.replace('Bearer ', '')
  try {
    jwt.verify(authorization, process.env.JWT_SECRET as string)
  }
  catch (error) {
    return response.status(401).json({ error: error.message })
  }

  const ticketId = request.query.ticketId as string
  const otpCode = request.query.otpCode as string
  if (!ticketId)
    return response.status(400).json({ error: 'ticketId is required' })

  if (!otpCode)
    return response.status(400).json({ error: 'otpCode is required' })

  const otpSecret = process.env.OTP_SECRET! as string

  const delta = verifyToken(otpSecret, otpCode)
  if (!delta || delta.delta !== 0)
    return response.status(401).json({ error: '2FA 验证码错误' })

  await kv.set(`ticket:${ticketId}`, {
    signTime: Date.now(),
  })
  return response.status(200).json({ success: true })
}
