import { TConstructorIngredient, TIngredient } from '@utils-types';
import { constructorSlice } from './constructorSlice';
import {
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  clearConstructor
} from './constructorSlice';

const constructorReducer = constructorSlice.reducer;

const initialState = {
  bun: null,
  ingredients: []
};

const mockSauce: TIngredient = {
  _id: '1',
  name: 'spicy соус',
  type: 'sauce',
  proteins: 5.55,
  fat: 228,
  calories: 1511,
  carbohydrates: 55,
  price: 85,
  image: 'komu na rodu napisano yarmo nosit',
  image_large: 'tot est byk',
  image_mobile: 'ok'
};

const mockBun: TIngredient = {
  _id: '2',
  name: 'nuclear bun',
  type: 'bun',
  proteins: 454,
  fat: 4545,
  calories: 86,
  carbohydrates: 22,
  price: 13,
  image: 'komu na rodu napisano yarmo nosit',
  image_large: 'tot est byk',
  image_mobile: 'ok'
};

const sauce1 = { ...mockSauce, id: '1', name: 'Соус 1' };
const sauce2 = { ...mockSauce, id: '2', name: 'Соус 2' };

const stateWithTwoSauces = {
  ...initialState,
  ingredients: [sauce1, sauce2]
};

describe('тест редьюсера', () => {
  test('передаем неизвестный экшен', () => {
    const newState = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(newState).toEqual(initialState);
  });

  test('ингридиент добавляется', () => {
    const addSauce = constructorReducer(initialState, addIngredient(mockSauce));
    const addBun = constructorReducer(initialState, addIngredient(mockBun));

    expect(addBun.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
    expect(addSauce.ingredients.length).toEqual(1);
    expect(addSauce.ingredients[0]).toEqual({
      ...mockSauce,
      id: expect.any(String)
    });
  });

  test('ингридиент удаляется', () => {
    const stateWithSauce = {
      ...initialState,
      ingredients: [
        {
          ...mockSauce,
          id: 'test-sauce-id'
        }
      ]
    };

    const stateWithotSauce = constructorReducer(
      stateWithSauce,
      removeIngredient('test-sauce-id')
    );

    expect(stateWithotSauce).toEqual(initialState);
  });

  test('изменение порядка: перемещение ингредиента вверх', () => {
    const newState = constructorReducer(
      stateWithTwoSauces,
      moveIngredientUp(1)
    );

    expect(newState.ingredients).toEqual([sauce2, sauce1]);
  });

  test('изменение порядка: перемещение ингредиента вниз', () => {
    const newState = constructorReducer(
      stateWithTwoSauces,
      moveIngredientDown(0)
    );

    expect(newState.ingredients).toEqual([sauce2, sauce1]);
  });

  test('конструктор после очистки пустой', () => {
    const newState = constructorReducer(stateWithTwoSauces, clearConstructor());

    expect(newState).toEqual(initialState);
  });
});
