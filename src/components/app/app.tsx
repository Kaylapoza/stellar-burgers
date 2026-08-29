import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../../routes/protected-route/protected-route';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import {
  fetchIngridients,
  selectIngredients,
  selectIngredientsError,
  selectIsIngredientsLoading
} from '../../services/slices/ingredientSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { getUser } from '../../services/slices/userSlice';

const App = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const dispatch = useDispatch();

  const backgroundLocation = location.state?.background;

  useEffect(() => {
    // Проверяем авторизацию при первом запуске приложения
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchIngridients());
  }, [dispatch]);

  const handleModalClose = () => {
    navigation(-1);
  };

  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectIngredientsError);

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Проверка состояния загрузки ингредиентов */}
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          {/* Основные маршруты */}
          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {/* Модальные окна */}
          {backgroundLocation && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal title='Детали заказа' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleModalClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <Modal title='Детали заказа' onClose={handleModalClose}>
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};
export default App;
