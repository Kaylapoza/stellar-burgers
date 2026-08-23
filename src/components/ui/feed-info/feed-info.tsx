import React, { FC, memo } from 'react';

import styles from './feed-info.module.css';

import { FeedInfoUIProps, HalfColumnProps, TColumnProps } from './type';
import { TOrder } from '@utils-types';
import { useSelector } from '../../../services/store';
import {
  selectOrders,
  selectTotal,
  selectTotalToday
} from '../../../services/slices/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfoUI: FC<FeedInfoUIProps> = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const total = useSelector(selectTotal);
  const totalToday = useSelector(selectTotalToday);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');
  const feed = {
    total,
    totalToday
  };
  return (
    <section>
      <div className={styles.columns}>
        <HalfColumn orders={readyOrders} title={'Готовы'} textColor={'blue'} />
        <HalfColumn orders={pendingOrders} title={'В работе'} />
      </div>
      <Column title={'Выполнено за все время'} content={total} />
      <Column title={'Выполнено за сегодня'} content={totalToday} />
    </section>
  );
};

const HalfColumn: FC<HalfColumnProps> = ({ orders, title, textColor }) => (
  <div className={`pr-6 ${styles.column}`}>
    <h3 className={`text text_type_main-medium ${styles.title}`}>{title}:</h3>
    <ul className={`pt-6  ${styles.list}`}>
      {orders.map((item, index) => (
        <li
          className={`text text_type_digits-default ${styles.list_item}`}
          style={{ color: textColor === 'blue' ? '#00cccc' : '#F2F2F3' }}
          key={index}
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const Column: FC<TColumnProps> = ({ title, content }) => (
  <>
    <h3 className={`pt-15 text text_type_main-medium ${styles.title}`}>
      {title}:
    </h3>
    <p className={`text text_type_digits-large ${styles.content}`}>{content}</p>
  </>
);
