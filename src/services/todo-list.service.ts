import type { List, Item } from '../components/Todo';
import redis, { databaseName } from '../commons/lib/redis';

export const create = async (name: string, throwError: boolean = true): Promise<List | null> => {
  try {
    const newId = Date.now().toString();
    const todoList: Partial<List> = { name, items: [] };

    await redis.hset(databaseName, { [newId]: JSON.stringify(todoList) });

    return { id: newId, ...todoList } as List;
  } catch (error) {
    console.error(error);
    if (throwError) throw error;
  }

  return null;
}

export const getAll = async (throwError: boolean = true): Promise<List[]> => {
  let todoLists: List[] = [];

  try {
    const data: any = await redis.hgetall(databaseName);
    if (!data) return todoLists;

    todoLists = Object.keys(data)
      .map((key) => ({ id: key, ...data[key] }))
      .sort((a, b) => parseInt(b.id) - parseInt(a.id));
  } catch (error) {
    console.error(error);
    if (throwError) throw error;
  }

  return todoLists;
}

export const get = async (id: string, throwError: boolean = true): Promise<List | null> => {
  try {
    const todoList = await redis.hget<List>(databaseName, id);
    if (todoList) {
      return { ...todoList, id }
    }
  } catch (error) {
    console.error(error);
    if (throwError) throw error;
  }

  return null
}

export const update = async (id: string, { text, status }: Item, isNew?: boolean, throwError: boolean = true): Promise<List | null> => {
  try {
    const todoList = await get(id);
    if (!todoList) {
      return null;
    }
    let newTodoList: Partial<List>;

    if (isNew) {
      const todo: Item = { text, status };

      newTodoList = {
        name: todoList.name,
        items: [
          todo,
          ...todoList.items
        ],
      };
    } else {
      newTodoList = {
        name: todoList.name,
        items: todoList.items.map(item => item.text === text ? ({
          ...item,
          status,
        }) : item)
      };
    }

    await redis.hset(databaseName, { [id]: JSON.stringify(newTodoList) });
    return { id, ...newTodoList } as List;
  } catch (error) {
    console.error(error);
    if (throwError) throw error;
  }

  return null;
}


export const remove = async (id: string, throwError: boolean = true): Promise<boolean> => {
  try {
    const removed = await redis.hdel(databaseName, id);
    return removed === 1;
  } catch (error) {
    console.error(error);
    if (throwError) throw error;
  }

  return false;
}
