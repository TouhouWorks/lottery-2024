import { kv } from '@vercel/kv'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const list = await kv.keys('lottery:*');
  const result = await kv.mget(list);
  return response.status(200).json(result);
}
