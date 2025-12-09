import { IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import {homeOutline} from 'ionicons/icons';
import './Home.css';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo';
import constants from '../constants/constants';
import { useUser } from '../context/userContext';
import { Roles } from '../constants/interfaces';

const Home: React.FC = () => {
  const router = useIonRouter();
  const {user} = useUser();
  const {t} = useTranslation();

  const navigateButton = (path: any) => {
    router.push(path, 'forward', 'push');
  };

  return (
    <IonPage>
      <IonHeader className='page-header'>
        <IonToolbar>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={homeOutline}/>
            <IonTitle> {t("MENU.HOME")} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className='' fullscreen>

        <div className='modos-home'>
          <Logo type="home" />

          <div className='modos'>
            <IonCard onClick={() => navigateButton("/app/aprendizaje")}>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon src={constants.aprendizajeIcon}/>
                  {t('MENU.APRENDIZAJE')}
                </IonCardTitle>
                <IonCardSubtitle>
                  {t('HOME.SUB_APRENDIZAJE')}
                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>

            <IonCard onClick={() => navigateButton("/app/simulacion")}>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon src={constants.simulacionIcon}/>
                  {t('MENU.SIMULACION')}
                </IonCardTitle>
                <IonCardSubtitle>
                  {t('HOME.SUB_SIMULACION')}
                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>

            <IonCard 
              onClick={() => navigateButton((user && user.role == Roles.PROFESOR) 
                ? "/app/evaluacionProfesor" : "/app/evaluacion")}
            >
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon src={constants.evaluacionIcon}/>
                  {t('MENU.EVALUACION')}
                </IonCardTitle>
                <IonCardSubtitle>
                  {t('HOME.SUB_EVALUACION')}
                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>

            {(user && user.role == Roles.PROFESOR) &&
              <IonCard 
                onClick={() => navigateButton("/app/evaluacionContinua")}>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon src={constants.continuaIcon}/>
                    {t('MENU.CONTINUA')}
                  </IonCardTitle>
                  <IonCardSubtitle>
                    {t('HOME.SUB_CONTINUA')}
                  </IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            }
            

            {(user && user.role == Roles.PROFESOR) &&
              <IonCard onClick={() => navigateButton("/app/alumnos")}>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon src={constants.alumnosIcon}/>
                    {t('MENU.USUARIOS')}
                  </IonCardTitle>
                  <IonCardSubtitle>
                    {t('HOME.SUB_ALUMNOS')}
                  </IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            }

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
