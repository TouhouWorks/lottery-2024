import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const list = await kv.keys('lottery:*');
  const result = await Promise.all(list.map(async (key) => {
    const value = await kv.get(key);
    return value;
  }));
  return response.status(200).json(result);
}