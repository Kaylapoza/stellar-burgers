import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { FC, useEffect } from 'react';
import {
  fetchFeeds,
  selectIsLoading,
  selectOrders
} from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngridients,
  selectIngredients
} from '../../services/slices/ingredientSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectIsLoading);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchFeeds());
    if (!ingredients.length) {
      dispatch(fetchIngridients());
    }
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
