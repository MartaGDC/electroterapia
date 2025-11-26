import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTextarea, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import constants from '../../constants/constants';
import simuladores from '../../constants/simuladores';
import { useLog } from '../../context/logContext';

const Actividad: React.FC = () => {
  const { room } = useLog();
  const router = useIonRouter();
  const {t} = useTranslation();

  const navigateButton = (event: any, path: any) => {
    event?.preventDefault();
    router.push(path, 'root', 'push');
  };

  console.log(room)

  return (
    <IonPage>
      <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={constants.evaluacionIcon}/>
            <IonTitle> {room?.name} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className='content-aprendizaje' fullscreen>
        <h2 className='ion-no-margin ion-no-padding'> 
          {t('ACTIVIDAD.DESCRIPCION.TITLE')} 
        </h2>
        <p style={{marginLeft: "3vw", marginRight: "3vw"}}> {room?.description} </p>

        {simuladores.map((simgroup, idx) => (
          <div key={idx}>
            <h2> {simgroup.group} </h2>

            <div className='lista-container'>
              <ul className='ion-no-padding ion-no-margin'>
                {simgroup.simuladores.map((sim, idx) => (
                  <li 
                    className='ion-no-margin' 
                    key={idx}
                    onClick={(e) => navigateButton(e, sim.evaluacion)}
                  >
                    <IonCard className='ion-no-margin'>
                      <IonCardHeader className='ion-no-padding'>
                        <IonCardTitle className='ion-no-margin ion-text-start'> 
                          {sim.name}
                        </IonCardTitle>
                        <IonCardSubtitle>
                          {sim.subname}
                        </IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent/>
                    </IonCard>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Actividad;