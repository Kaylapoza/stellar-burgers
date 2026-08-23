import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  selectConstructorItems
} from '../../services/slices/constructorSlice';
import {
  createOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);

  const orderRequest = useSelector(selectOrderRequest);

  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    // 1. Не даем отправить заказ без булки
    if (!constructorItems.bun || orderRequest) return;

    // 2. Если пользователь не вошёл — перенаправляем на /login
    if (!user) {
      navigate('/login');
      return;
    }

    // 3. Собираем массив _id ингредиентов [булка_id, ...ингредиенты_id, булка_id]
    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    // 4. Отправляем заказ на сервер и очищаем конструктор
    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((err) => console.error(err));
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
