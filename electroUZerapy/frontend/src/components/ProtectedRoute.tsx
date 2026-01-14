import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { IonSpinner } from '@ionic/react';
import { useLog } from '../context/logContext';

interface ProtectedRouteProps {
  protect?: boolean;
  evaluacion?: boolean;
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = 
({ protect = true, evaluacion = false, component: Component, allowedRoles, ...rest }) => {
  const { room } = useLog();
  const { user, loading } = useUser();

  if (evaluacion && room == null) return <Redirect to="/app/evaluacion" />;
  return (
    <Route
      {...rest}
      render={(props) => {
        console.log('ProtectedRoute render:', rest.path);
        console.log('User:', user, 'Loading:', loading, 'AllowedRoles:', allowedRoles);

        if (!protect) {
          console.log('Ruta pública, renderizando componente...');
          return <Component {...props} />;
        }
        if (loading) {
          console.log('Cargando user, mostrando spinner...');
          return <IonSpinner name="dots" />;
        }
        if (user && allowedRoles.includes(user.role)) {
          console.log('Usuario permitido, renderizando componente...');
          return <Component {...props} />;
        }

        if (user != null) {
          console.log('Usuario logueado pero rol no permitido, redirigiendo a /app/home');
          return <Redirect to="/app/home" />;
        }

        console.log('Usuario no logueado, redirigiendo a /');
        return <Redirect to="/" />;
      }}
    />
  );
};

export default ProtectedRoute;