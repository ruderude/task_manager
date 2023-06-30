import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  console.log(session);

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  const { method } = req;

  switch (method) {
    case 'GET':
      res.json({ message: 'GETリクエスト' });
      break;
    case 'POST':
      const { userId, task } = req.body

      if (!userId || !task) {
        res.status(400).json({ message: 'Bad Request.' })
        return
      }

      const resTask = await prisma.task.create({
        data: {
          title: task,
          done: false,
          userId: userId,
        },
      })

      res.status(200).json({ message: 'OK' })
      break;
    case 'PUT':
      const { taskId, done } = req.body

      if (!taskId || done === undefined) {
        res.status(400).json({ message: 'Bad Request.' })
        return
      }

      const resDone = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          done: done
        }
      })

      res.status(200).json({ message: 'OK' })
      break;
    default:
      res.json({ message: 'GET/POST/PATCHでもないリクエストです。' });
      break;
  }

}

export default handler