import { ingredientsSlice } from './ingredientSlice';
import { fetchIngridients } from './ingredientSlice';
import { getIngredientsApi } from '@api';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

const ingredientReducer = ingredientsSlice.reducer;

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    calories: 1255,
    carbohydrates: 53,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null
};

describe('тест редьюсера', () => {
  test('передаем неизвестный экшен', () => {
    const newState = ingredientReducer(undefined, { type: 'UNKNOWN' });

    expect(newState).toEqual(initialState);
  });

  test('обработка fetchIngridients.pending', () => {
    const stateWithError = { ...initialState, error: 'Прошлая ошибка' };

    const state = ingredientReducer(
      stateWithError,
      fetchIngridients.pending('reqestId')
    );

    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  test('обработка fetchIngridients.fullfiled', () => {
    const loadingState = { ...initialState, isLoading: true };

    const state = ingredientReducer(
      loadingState,
      fetchIngridients.fulfilled(mockIngredients, 'reqestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('обработка fetchIngridients.rejected', () => {
    const loadingState = { ...initialState, isLoading: true };
    const error = new Error('Ошибка сети');

    const state = ingredientReducer(
      loadingState,
      fetchIngridients.rejected(error, 'requestId')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).not.toBeNull();
  });
});
