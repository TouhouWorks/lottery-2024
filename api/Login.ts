import process from 'node:process'

import jwt from 'jsonwebtoken'
import { verifyToken } from 'node-2fa'

import type {
  VercelRequest,
  VercelResponse,
} from '@vercel/node'

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
