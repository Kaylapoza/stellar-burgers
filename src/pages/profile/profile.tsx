import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import {
  clearUserError,
  selectUser,
  selectUserError,
  updateUser
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */

  const dispatch = useDispatch();
  const updateUserError = useSelector(selectUserError);
  const user = useSelector(selectUser);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user?.name, user?.email]);

  // Очистка ошибки при размонтировании компонента
  useEffect(
    () => () => {
      dispatch(clearUserError());
    },
    [dispatch]
  );

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password ? { password: formValue.password } : {})
      })
    );
    // Очищаем поле ввода пароля после отправки
    setFormValue((prev) => ({ ...prev, password: '' }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (updateUserError) {
      dispatch(clearUserError());
    }
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
