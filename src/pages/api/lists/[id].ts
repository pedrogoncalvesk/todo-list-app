import type { NextApiRequest, NextApiResponse } from 'next'

import type { List, Item } from '../../../components/Todo';
import redis, { databaseName } from '../../../commons/lib/redis';

export const get = async (id: string): Promise<List | null> => {
  const todoList = await redis.hget<List>(databaseName, id);
  if (todoList) {
    return { ...todoList, id }
  }
  return null
}

export const createTodo = async (id: string, text: string): Promise<List | null> => {
  const todoList = await get(id);
  if (!todoList) {
    return null;
  }
  const todo: Item = { text, status: false };

  const newTodoList: Partial<List> = {
    name: todoList.name,
    items: [
      todo,
      ...todoList.items
    ],
  };
  await redis.hset(databaseName, { [id]: JSON.stringify(newTodoList) });
  return { id, ...newTodoList } as List;
}

export const updateTodo = async (id: string, text: string, status: boolean): Promise<List | null> => {
  const todoList = await get(id);
  if (!todoList) {
    return null;
  }

  const newTodoList: Partial<List> = {
    name: todoList.name,
    items: todoList.items.map(item => item.text === text ? ({
      ...item,
      status
    }) : item)
  };
  await redis.hset(databaseName, { [id]: JSON.stringify(newTodoList) });
  return { id, ...newTodoList } as List;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const id: string = String(req.query.id);
  const { text, status } = req.body;

  switch (method) {
    case "GET":
      const todoList: List | null = await get(id)
      if (todoList) {
        return res.status(200).json(todoList);
      }
      return res.status(404).end();

    case "POST":
      const createdTodoList = await createTodo(id, text);
      if (createdTodoList) {
        return res.status(200).json(createdTodoList);
      }
      return res.status(404).end();

    case "PATCH":
      const updatedTodoList = await updateTodo(id, text, status);
      if (updatedTodoList) {
        return res.status(200).json(updatedTodoList);
      }
      return res.status(404).end();

    case "DELETE":
      await redis.hdel(databaseName, id);
      return res.status(200).end();

    default:
      res.status(405).json({ message: "Method Not Allowed" });
  }
}
