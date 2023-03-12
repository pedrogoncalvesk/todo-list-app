import type { NextApiRequest, NextApiResponse } from 'next'

import { create, getAll } from '../../../services/todo-list.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { name } = req.body;

  switch (method) {
    case "POST":
      const todo = await create(name);

      if (todo) {
        return res.status(201).json(todo);
      }
      return res.status(500).end();

    case "GET":
      const todos = await getAll();

      return res.status(200).json(todos);

    default:
      res.status(405).json({ message: "Method Not Allowed" });
  }
}
