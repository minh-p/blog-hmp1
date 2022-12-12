import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma'

// PUT /api/publish/:id
export default async function handle(req, res) {
  const postId = req.query.id;
  const session = await getSession({ req })

  const { title, content} = req.body;

  if (session) {
    const post = await prisma.post.update({
      where: { id: Number(postId) },
      data: { published: true, title: title, content: content },
    });
    res.json(post);
  } else {
    res.status(401).send({ message: 'Unauthorized' })
  }
}
