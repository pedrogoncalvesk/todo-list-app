import type { NextApiRequest, NextApiResponse } from 'next'

import type { List, Item } from '../../../components/Todo';
import redis, { databaseName } from '../../../commons/lib/redis';

export const findAll = async (): Promise<List[]> => {
  let todoLists: List[] = [];

  const data: any = await redis.hgetall(databaseName);
  if (!data) return todoLists;

  todoLists = Object.keys(data)
    .map((key) => ({ id: key, ...data[key] }))
    .sort((a, b) => parseInt(b.id) - parseInt(a.id));

  return todoLists;
}

export const create = async (name: string): Promise<List> => {
  const newId = Date.now().toString();
  const todoList: Partial<List> = { name, items: [] };

  await redis.hset(databaseName, { [newId]: JSON.stringify(todoList) });

  return { id: newId, ...todoList } as List;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const { name } = req.body;

  switch (method) {
    case "GET":
      const todos = await findAll();

      return res.status(200).json(todos);

    case "POST":
      const todo = await create(name);

      return res.status(201).json(todo);

    default:
      res.status(405).json({ message: "Method Not Allowed" });
  }
}
