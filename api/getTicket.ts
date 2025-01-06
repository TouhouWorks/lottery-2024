import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const ticketId = request.query.ticketId as string
  const ticket = await kv.get(`ticket:${ticketId}`)
  if (!ticket)
    return response.status(404).json({ error: 'TICKET_NOT_FOUND' })

  return response.status(200).json(ticket)
}
