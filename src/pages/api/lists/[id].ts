import type { NextApiRequest, NextApiResponse } from 'next'

import { get, update, remove } from '../../../services/todo-list.service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const id: string = String(req.query.id);
  const { text, status } = req.body;

  switch (method) {
    case "GET":
      const todoList = await get(id)
      if (todoList) {
        return res.status(200).json(todoList);
      }
      return res.status(404).end();

    case "POST":
      const createdTodoList = await update(id, { text, status: false }, true);
      if (createdTodoList) {
        return res.status(200).json(createdTodoList);
      }
      return res.status(404).end();

    case "PATCH":
      const updatedTodoList = await update(id, { text, status });
      if (updatedTodoList) {
        return res.status(200).json(updatedTodoList);
      }
      return res.status(404).end();

    case "DELETE":
      const removed = await remove(id);
      return res.status(removed ? 200 : 500).end();

    default:
      res.status(405).json({ message: "Method Not Allowed" });
  }
}
