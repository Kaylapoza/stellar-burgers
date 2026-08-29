import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  selectOrders,
  selectTotal,
  selectTotalToday
} from '../../services/slices/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders = useSelector(selectOrders);
  const total = useSelector(selectTotal);
  const totalToday = useSelector(selectTotalToday);

  // Готовые заказы (done)
  const readyOrders = orders
    .filter((item) => item.status === 'done')
    .map((item) => item.number)
    .slice(0, 20);

  // Заказы в работе (pending)
  const pendingOrders = orders
    .filter((item) => item.status === 'pending')
    .map((item) => item.number)
    .slice(0, 20);

  const feed = {
    total,
    totalToday
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
