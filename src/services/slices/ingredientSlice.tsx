import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface TIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngridients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsIngredientsLoading: (state) => state.isLoading,
    selectIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngridients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngridients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингридиентов';
      })
      .addCase(fetchIngridients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const {
  selectIngredients,
  selectIsIngredientsLoading,
  selectIngredientsError
} = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
