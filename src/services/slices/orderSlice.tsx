import { getOrdersApi, orderBurgerApi, TNewOrder } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// type TOrderData = Awaited<ReturnType<typeof orderBurgerApi>>['order'];

interface TOrderState {
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: TOrderState = {
  orders: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const getOrders = createAsyncThunk('order/getOrders', async () => {
  const orders = await getOrdersApi();
  return orders;
});

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsIds: string[]) => {
    const data = await orderBurgerApi(ingredientsIds);
    const order: TOrder = {
      ...data.order,
      ingredients: ingredientsIds
    };
    return order;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(getOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка получения заказов';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload; // Записываем массив заказов в стейт
      });
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrders: (state) => state.orders
  }
});

export const { clearOrder } = orderSlice.actions;
export const { selectOrderRequest, selectOrderModalData, selectOrders } =
  orderSlice.selectors;
export default orderSlice.reducer;
