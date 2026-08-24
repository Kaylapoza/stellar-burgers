import { ProfileOrdersUI } from '@ui-pages';

import { FC, useEffect } from 'react';
import { getOrders, selectOrders } from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  // 1. Достаем заказы из Redux-стора
  const orders = useSelector(selectOrders);

  // 2. При монтировании компонента отправляем запрос на получение заказов пользователя
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
