import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await getServerSession(req, res, authOptions);

  // console.log(session);

  // if (!session) {
  //   res.status(401).json({ message: 'You must be logged in.' });
  //   return;
  // }

  console.log('req', req.body)

  const { userId, task } = req.body
  console.log('userId', userId)
  console.log('task', task)

  if (!userId || !task) {
    res.status(400).json({ message: 'Bad Request.' })
    return
  }

  // const resTask = await prisma.task.create({
  //   data: {
  //     title: task,
  //     done: false,
  //   },
  // })

  const resData = {
    userId: userId,
    task: task,
  }

  res.status(200).json(resData)
}

export default handler