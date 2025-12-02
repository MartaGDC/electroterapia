import { IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { homeOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import React from 'react';
import Home from '../pages/Home';
import Aprendizaje from '../pages/Aprendizaje';
import Simulacion from '../pages/Simulacion';
import Evaluacion from '../pages/Evaluacion';
import "./Menu.css"
import { useTranslation } from 'react-i18next';
import GalvanicoAprendizaje from '../pages/Aprendizaje/GalvanicaAprendizaje';

import { useUser } from '../context/userContext';
import constants from '../constants/constants';
import { Roles } from '../constants/interfaces';
import ProtectedRoute from './ProtectedRoute';
import Alumnos from '../pages/Alumnos';

import EvaluacionProfesor from '../pages/EvaluacionProfesor';


const Menu: React.FC = () => {
  const router = useIonRouter();
  const {t} = useTranslation();
  const {user} = useUser();
  const {logout} = useUser();

  const paths = [
    { name: t('MENU.HOME'), url: "/app/home", icon: homeOutline },
    { name: t('MENU.APRENDIZAJE'), url: "/app/aprendizaje", icon: constants.aprendizajeIcon },
    { name: t('MENU.SIMULACION'), url: "/app/simulacion", icon: constants.simulacionIcon },
    { 
      name: t('MENU.EVALUACION'), 
      url: user && user.role == Roles.ALUMNO ? "/app/evaluacion" : "/app/evaluacionProfesor", 
      icon: constants.evaluacionIcon 
    },
    ...(user?.role === "teacher"
      ? [{ name: t('MENU.USUARIOS'), url: "/app/alumnos", icon: constants.alumnosIcon }]
      : [])
  ];

  const navigateButton = (path: string) => {
    router.push(path, "root", "replace");
    window.location.reload();
  }

  const allUsers = [Roles.ALUMNO, Roles.PROFESOR];

  return (
    <IonPage>
      {/* <IonSplitPane contentId='main'> */}
      <IonMenu contentId='main'>
        <IonHeader>
          <IonToolbar color={'primary'}>
            <IonTitle className='menu-titulo'> ElectroUZerapy </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='' color={'primary'}>
          {paths.map((path, idx) => (
            <IonMenuToggle className='menu-item' key={idx} autoHide={false}>
              <IonItem onClick={() => navigateButton(path.url)} detail={true} color={'primary'}>
                <IonIcon className='ion-margin-end' icon={path.icon}/>
                {path.name}
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonContent>
        <IonFooter>
          <IonMenuToggle className='menu-item' autoHide={false}>
            <IonItem routerLink='/app/ajustes' detail={true} color={'primary'}>
              <IonIcon className='ion-margin-end' icon={settingsOutline}/>
              {t("MENU.AJUSTES")}
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle className='menu-item' autoHide={false}>
            <IonItem routerLink='/' onClick={logout} color={'primary'}>
              <IonIcon className='ion-margin-end' icon={logOutOutline}/>
              {t("MENU.CERRAR_SESION")}
            </IonItem>
          </IonMenuToggle>
        </IonFooter>
      </IonMenu>

      <IonRouterOutlet id='main'>
        <ProtectedRoute protect={false} exact path="/app/home" component={Home} allowedRoles={allUsers} />

        {/* Aprendizaje */}
        <ProtectedRoute protect={false} exact path="/app/aprendizaje" component={Aprendizaje} allowedRoles={allUsers}/>
        <ProtectedRoute protect={false} exact path="/app/aprendizaje/galvanica" component={GalvanicoAprendizaje} allowedRoles={allUsers}/>

        {/* Simulación */}
        <ProtectedRoute protect={false} exact path="/app/simulacion" component={Simulacion} allowedRoles={allUsers}/>

        {/* Evaluación */}
        <ProtectedRoute protect={false} exact path="/app/evaluacion" component={Evaluacion} allowedRoles={[Roles.ALUMNO]}/>
        
        <ProtectedRoute protect={false} exact path="/app/evaluacionProfesor" component={EvaluacionProfesor} allowedRoles={[Roles.PROFESOR]}/>
        

        {/* Alumnos */}
        <ProtectedRoute protect={false} exact path="/app/alumnos" component={Alumnos} allowedRoles={[Roles.PROFESOR]} />

        {/* Ajustes */}

      </IonRouterOutlet>
      {/* </IonSplitPane> */}
    </IonPage>
  );
};

export default Menu;