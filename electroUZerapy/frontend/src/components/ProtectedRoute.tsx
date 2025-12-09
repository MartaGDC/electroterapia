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
        if (!protect) return <Component {...props}/>; //Se ha añadido esto para poder aceptar props (en concreto para salaProfesor/{id})
        if (loading) return <IonSpinner name="dots"/>;
        if (user && allowedRoles.includes(user.role)) return <Component {...props} />;
        if (user != null) return <Redirect to="/app/home" />;
        return <Redirect to="/" />
      }}
    />
  );
};

export default ProtectedRoute;