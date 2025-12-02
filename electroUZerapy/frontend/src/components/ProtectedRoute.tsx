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
  if (!protect) return <Component/>
  else if (loading) return <IonSpinner name="dots" />;
  else return (
    <Route
      {...rest}
      render={props =>
        (user && allowedRoles.includes(user.role)) ? (
          <Component {...props} />
        ) : (user != null) ? (
          <Redirect to="/app/home" />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default ProtectedRoute;