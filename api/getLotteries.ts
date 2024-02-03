import { kv } from '@vercel/kv'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const list = (await kv.keys('lottery:*'))
  if (list.length === 0 || !list)
    return response.status(200).json([])

  const result = await kv.mget(list).then(values => uniqueArrayByKey(values, 'qqNumber'))

  return response.status(200).json(result)
}

function uniqueArrayByKey(array: any[], key: string) {
  return [...new Map(array.map(item => [item[key], item])).values()]
}
