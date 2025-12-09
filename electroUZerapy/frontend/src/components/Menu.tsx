import { IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { homeOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

import "./Menu.css"

import Home from '../pages/Home';
import Aprendizaje from '../pages/Aprendizaje';
import Simulacion from '../pages/Simulacion';
import Evaluacion from '../pages/Evaluacion';
import Ajustes from '../pages/Ajustes/Ajustes';

import GalvanicoAprendizaje from '../pages/Aprendizaje/GalvanicaAprendizaje';
import MonofasicaAprendizaje from '../pages/Aprendizaje/MonofasicaAprendizaje';
import BifasicaAprendizaje from '../pages/Aprendizaje/BifasicaAprendizaje';
import MediaFrecuenciaAprendizaje from '../pages/Aprendizaje/MediaFrecuenciaAprendizaje';
import DiatermiaAprendizaje from '../pages/Aprendizaje/DiatermiaAprendizaje';
import OndaCortaAprendizaje from '../pages/Aprendizaje/OndaCortaAprendizaje';
import MicroOndasAprendizaje from '../pages/Aprendizaje/MicroOndasAprendizaje';
import InfrarrojosAprendizaje from '../pages/Aprendizaje/InfrarrojosAprendizaje';
import LaserAprendizaje from '../pages/Aprendizaje/LaserAprendizaje';
import UVAprendizaje from '../pages/Aprendizaje/UVAprendizaje';
import MagnetoterapiaAprendizaje from '../pages/Aprendizaje/MagnetoterapiaAprendizaje';
import UltrasonidosAprendizaje from '../pages/Aprendizaje/UltrasonidosAprendizaje';
import OndasChoqueAprendizaje from '../pages/Aprendizaje/OndasChoqueAprendizaje';

import GalvanicaSimulacion from '../pages/Simulacion/GalvanicaSimulacion';
import MonofasicaSimulacion from '../pages/Simulacion/MonofasicaSimulacion';
import BifasicaSimulacion from '../pages/Simulacion/BifasicaSimulacion';
import MediaFrecuenciaSimulacion from '../pages/Simulacion/MediaFrecuenciaSimulacion';
import DiatermiaSimulacion from '../pages/Simulacion/DiatermiaSimulacion';
import OndaCortaSimulacion from '../pages/Simulacion/OndaCortaSimulacion';
import MicroOndasSimulacion from '../pages/Simulacion/MicroOndasSimulacion';
import InfrarrojosSimulacion from '../pages/Simulacion/InfrarrojosSimulacion';
import LaserSimulacion from '../pages/Simulacion/LaserSimulacion';
import UVSimulacion from '../pages/Simulacion/UVSimulacion';
import MagnetoterapiaSimulacion from '../pages/Simulacion/MagnetoterapiaSimulacion';
import UltrasonidosSimulacion from '../pages/Simulacion/UltrasonidosSimulacion';
import OndasChoqueSimulacion from '../pages/Simulacion/OndasChoqueSimulacion';

import EvaluacionProfesor from '../pages/EvaluacionProfesor';
import SalaProfesor from '../pages/Evaluacion/SalaProfesor';
import VisualizadorLog  from '../pages/Evaluacion/VisualizadorLog';
import Actividad from '../pages/Evaluacion/Actividad';

import Continua from '../pages/EvaluacionContinua';
      
import { useUser } from '../context/userContext';
import constants from '../constants/constants';
import { Roles } from '../constants/interfaces';
import ProtectedRoute from './ProtectedRoute';
import Alumnos from '../pages/Alumnos';



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
    ? [
      { name: t('MENU.USUARIOS'), url: "/app/alumnos", icon: constants.alumnosIcon },
      { name: t('MENU.CONTINUA'), url: "/app/evaluacionContinua", icon: constants.continuaIcon }
    ]
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
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/bifasica" component={BifasicaAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/monofasica" component={MonofasicaAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/mediafrecuencia" component={MediaFrecuenciaAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/diatermia" component={DiatermiaAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/ondacorta" component={OndaCortaAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/microondas" component={MicroOndasAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/infrarrojos" component={InfrarrojosAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/laser" component={LaserAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/ultravioletas" component={UVAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/magnetoterapia" component={MagnetoterapiaAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/ultrasonidos" component={UltrasonidosAprendizaje} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/aprendizaje/ondaschoque" component={OndasChoqueAprendizaje} allowedRoles={allUsers}/>

      {/* Simulación */}
      <ProtectedRoute protect={false} exact path="/app/simulacion" component={Simulacion} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/galvanica" component={() => <GalvanicaSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/monofasica" component={() => <MonofasicaSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/bifasica" component={() => <BifasicaSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/mediafrecuencia" component={() => <MediaFrecuenciaSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/diatermia" component={() => <DiatermiaSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/ondacorta" component={() => <OndaCortaSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/microondas" component={() => <MicroOndasSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/infrarrojos" component={() => <InfrarrojosSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/laser" component={() => <LaserSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/magnetoterapia" component={() => <MagnetoterapiaSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/ultrasonidos" component={() => <UltrasonidosSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/ultravioletas" component={() => <UVSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>
      <ProtectedRoute protect={false} exact path="/app/simulacion/ondaschoque" component={() => <OndasChoqueSimulacion type={"simulacion"}/>} allowedRoles={allUsers}/>

      {/* Evaluación */}
      <ProtectedRoute protect={false} exact path="/app/evaluacion" component={Evaluacion} allowedRoles={[Roles.ALUMNO]}/>
      
      <ProtectedRoute protect={false} exact path="/app/evaluacionProfesor" component={EvaluacionProfesor} allowedRoles={[Roles.PROFESOR]}/>
      <ProtectedRoute protect={false} exact path="/app/salaProfesor/:id" component={SalaProfesor} allowedRoles={[Roles.PROFESOR]}/>
      <ProtectedRoute protect={false} exact path="/app/visualizadorLog/:id" component={VisualizadorLog} allowedRoles={[Roles.PROFESOR]}/>
      
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/actividad" component={Actividad} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/galvanica" component={() => <GalvanicaSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/monofasica" component={() => <MonofasicaSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/bifasica" component={() => <BifasicaSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/mediafrecuencia" component={() => <MediaFrecuenciaSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/diatermia" component={() => <DiatermiaSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/ondacorta" component={() => <OndaCortaSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/microondas" component={() => <MicroOndasSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/infrarrojos" component={() => <InfrarrojosSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/laser" component={() => <LaserSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/magnetoterapia" component={() => <MagnetoterapiaSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/ultrasonidos" component={() => <UltrasonidosSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/ultravioletas" component={() => <UVSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>
      <ProtectedRoute protect={false} evaluacion exact path="/app/evaluacion/ondaschoque" component={() => <OndasChoqueSimulacion type={"evaluacion"}/>} allowedRoles={[Roles.ALUMNO]}/>

      {/*Continua*/}
      <ProtectedRoute protect={false} exact path="/app/evaluacionContinua" component={Continua} allowedRoles={[Roles.PROFESOR]} />

      {/* Alumnos */}
      <ProtectedRoute protect={false} exact path="/app/alumnos" component={Alumnos} allowedRoles={[Roles.PROFESOR]} />

      {/* Ajustes */}
      <ProtectedRoute protect={false} exact path="/app/ajustes" component={Ajustes} allowedRoles={allUsers}/>

    </IonRouterOutlet>
    {/* </IonSplitPane> */}
  </IonPage>
);
};

export default Menu;