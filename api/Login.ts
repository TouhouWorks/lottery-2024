import { kv } from '@vercel/kv'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { generateSecret, verifyToken } from 'node-2fa'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const otpCode = request.body.otpCode as string
  if (!otpCode)
    return response.status(400).json({ error: 'otpCode is required' })

  const otpSecret = process.env.OTP_SECRET! as string

  if (!otpSecret)
    return response.status(400).json({ error: 'otpSecret is required in env' })

  const delta = verifyToken(otpSecret, otpCode)

  if (!delta || delta.delta !== 0)
    return response.status(401).json({ error: 'Unauthorized' })

  const jwtToken = jwt.sign({}, process.env.JWT_SECRET as string)
  return response.status(200).json({ jwtToken })
}
