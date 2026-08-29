// src/components/protected-route/protected-route.tsx
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean; // true для страниц /login, /register и т.д.
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Для защищенных роутов (/profile, /profile/orders), если не авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Для роутов только неавторизованных (/login), если уже вошел
  if (onlyUnAuth && user) {
    const from = location.state?.from;
    // Защита от бесконечного цикла: если from ведет на /login или отсутствует, отправляем на главную '/'
    const target =
      from && from.pathname !== '/login' && from.pathname !== '/register'
        ? from
        : { pathname: '/' };

    return <Navigate replace to={target} />;
  }

  return children;
};
