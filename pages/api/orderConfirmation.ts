import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  success: boolean
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.status(200).json({ success: true })
}
