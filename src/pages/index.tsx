import { useState, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { NextRouter, useRouter } from 'next/router';
import Head from 'next/head'
import Image from 'next/image'

import Todo, { List, Item } from '../components/Todo';
import { getAll } from '../services/todo-list.service';
import loaderGif from '../assets/loader.gif'
import debounce from '../commons/lib/debounce';
import styles from '../styles/Home.module.css'

export default function Home({ todoLists }: { todoLists: List[] }) {
  const router: NextRouter = useRouter()
  const [data, setData] = useState<List[]>(todoLists || []);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const createTodoList = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true)
    const response = await fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: text }),
    })
    const newTodoList: List = await response.json()
    setData([
      newTodoList,
      ...data,
    ])
    setLoading(false);
    router.push(`/list/${newTodoList.id}`)
  }

  const openTodoList = debounce(async (event: MouseEvent<HTMLAnchorElement>, todoList: List) => {
    event.preventDefault();

    router.push(`/list/${todoList.id}`)
  })

  const removeTodoList = debounce(async (event: MouseEvent<HTMLAnchorElement>, todoList: List) => {
    event.preventDefault();

    setLoading(true)
    await fetch(`/api/lists/${todoList.id}`, {
      method: 'DELETE'
    })

    setData(data.filter(d => d.id !== todoList.id))

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
            TODO List
          </h1>
          <h4 className={styles.subTitle}>Crie uma nova lista de tarefas digitando o título abaixo!</h4>
          {
            loading ?
              <div className={styles.cardLoader}>
                <Image src={loaderGif} alt="loader" />
              </div>
              :
              <form className={styles.cardForm} onSubmit={createTodoList}>
                <input className={styles.cardInput} type="text"
                  name="todo" onChange={handleChangeText}
                  placeholder="Digite o nome da lista de tarefas" />
              </form>
          }

          {data.map(todoList => (
            <Todo
              key={todoList.id}
              item={{ id: todoList.id, text: todoList.name } as Partial<Item>}
              handleClick={openTodoList}
              handleRemove={removeTodoList}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const todoLists = await getAll(false);

  return {
    props: { todoLists },
  }
}
