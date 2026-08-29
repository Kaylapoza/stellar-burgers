import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientSlice';
import { useParams } from 'react-router-dom';
import { selectOrders } from '../../services/slices/feedSlice';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const orders = useSelector(selectOrders);

  const [orderData, setOrderData] = useState<TOrder | null>(null);

  // 1. Пытаемся найти заказ в Redux-сторе (из ленты)
  const orderFromStore = useMemo(
    () => orders.find((item) => item.number === Number(number)),
    [orders, number]
  );

  useEffect(() => {
    if (orderFromStore) {
      setOrderData(orderFromStore);
    } else if (number) {
      // 2. Если в сторе нет (перезагрузка страницы) — запрашиваем через API
      getOrderByNumberApi(Number(number)).then((data) => {
        if (data?.orders?.[0]) {
          setOrderData(data.orders[0]);
        }
      });
    }
  }, [orderFromStore, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
