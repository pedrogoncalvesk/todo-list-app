import { useState, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { NextPageContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Todo, { List, Item } from '../../components/Todo';
import { get } from '../api/lists/[id]'
import loaderGif from '../../assets/loader.gif'
import debounce from '../../commons/lib/debounce';
import env from '../../commons/environment';
import styles from '../../styles/Home.module.css'


export default function TodoList({ todoList }: { todoList: List }) {
  const [data, setData] = useState<Item[]>(todoList.items || []);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const createTodo = async (event: FormEvent<HTMLFormElement>, todoList: List) => {
    event.preventDefault();

    setLoading(true)
    await fetch(`/api/lists/${todoList.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    setData([
      { text, status: false } as Item,
      ...data,
    ])
    setLoading(false);
  }

  const updateTodo = debounce(async (event: MouseEvent<HTMLAnchorElement>, item: Item) => {
    event.preventDefault();

    setLoading(true)
    const response = await fetch(`/api/lists/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    })

    const updatedTodoList: List = await response.json();
    setData(updatedTodoList.items);
    setLoading(false);
  })

  const handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>TODO APP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <h1 className={styles.title}>
            TODO List: <a href={`/list/${todoList.id}`}>{todoList.name}</a>
          </h1>
          <h4 className={styles.subTitle}>Compartilhe o link da sua lista de tarefas: <a href={`/list/${todoList.id}`} target="_blank" rel="noopener noreferrer">{`${env.NEXT_PUBLIC_APP_URL}/list/${todoList.id}`}</a></h4>
          {
            loading ?
              <div className={styles.cardLoader}>
                <Image src={loaderGif} alt="loader" />
              </div>
              :
              <form className={styles.cardForm} onSubmit={e => createTodo(e, todoList)}>
                <input className={styles.cardInput} type="text"
                  name="todo" onChange={handleChangeText}
                  placeholder="Digite sua tarefa" />
              </form>
          }

          {data.map((item, index) => (
            <Todo
              key={index}
              item={{ ...item, id: todoList.id }}
              handleClick={updateTodo}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query
  const todoList = await get(String(id));

  return {
    props: { todoList },
  }
}
