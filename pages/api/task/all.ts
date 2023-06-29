import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
  age: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('req', req)
  res.status(200).json({ name: 'John All', age: 27 })
}
