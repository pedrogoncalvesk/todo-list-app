import { MouseEvent, Fragment } from 'react';

import styles from './Todo.module.css'

export type Item = {
  id?: string;
  text: string;
  status: boolean;
}

export type List = {
  id: string;
  name: string;
  items: Item[];
}

export type TodoProps = {
  item: Item | Partial<Item>;
  handleClick?: (event: MouseEvent<HTMLAnchorElement>, item: Item | Partial<Item>) => void;
  handleRemove?: (event: MouseEvent<HTMLAnchorElement>, item: Item | Partial<Item>) => void;
}

export default function Todo({ item, handleClick, handleRemove }: TodoProps) {
  return (
    <div className={styles.card}>
      <a
        className={item.status === true ? `${styles.textItem} ${styles.scratched}` : item.status === false ? styles.textItem : styles.text}
        onClick={e => handleClick && handleClick(e, { ...item, text: item.text || '', status: !item.status })}
      >
        <p>{item.text}</p>
      </a>
      {handleRemove && (
        <a
          className={styles.iconRemove}
          onClick={e => handleRemove(e, item)}
        >
          <span>✕</span>
        </a>
      )}
    </div>
  )
}
