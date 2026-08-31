import { TIngredient } from '@utils-types';

export type TIngredientsCategoryProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  'data-testid': string;
};
