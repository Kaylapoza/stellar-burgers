import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser, selectUserError } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setErrorText('');

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        // При успехе возвращаем пользователя на прежнюю страницу
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setErrorText(err.message || 'Неверный email или пароль');
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
