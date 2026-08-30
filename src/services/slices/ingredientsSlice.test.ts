import { ingredientsSlice } from './ingredientSlice';
import { fetchIngridients } from './ingredientSlice';
import { getIngredientsApi } from '@api';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

const ingredientReducer = ingredientsSlice.reducer;

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
});
