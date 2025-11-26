import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './EvaluacionProfesor.css'
import constants from '../constants/constants';
import { Room } from '../constants/interfaces';
import { getAllRooms } from '../api/room';
import RoomCrearModal from './Evaluacion/RoomCrearModal';

const EvaluacionProfesor: React.FC = () => {
  const {t} = useTranslation();
  const router = useIonRouter();

  const [actividades, setActividades] = useState<Room[]>([]);
  const [modalCrear, setModalCrear] = useState(false);

  const navigateSala = (id: string) => {
    event?.preventDefault();
    router.push(`/app/salaProfesor/${id}`, 'root', 'replace');
  }

  useEffect(() => {
    const getActividades = async () => {
      const res = await getAllRooms();

      if (res.status == 200) {
        setActividades(res.data.rooms)
      }
    }

    getActividades();
  }, []);

  return (
    <IonPage>
      <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={constants.evaluacionIcon}/>
            <IonTitle> {t("MENU.EVALUACION")} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding' fullscreen>
        <h2 className='ion-margin-top ion-margin-start ion-no-margin'> 
          {t("EVALUACION.ACTIVIDADES")} 
        </h2>
        <div className='lista-ev-prof-container'>
          <ul className='ion-no-padding ion-no-margin'>
            {actividades.map((act, idx) => (
              <li className='ion-no-margin' key={idx}>
                <IonCard className='ion-no-margin' onClick={() => navigateSala(act._id)}>
                  <IonCardHeader className='ion-no-padding'>
                    <div 
                      className='ion-padding-end'
                      style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                    >
                      <IonCardTitle className='ion-no-margin ion-text-start'> 
                          {act.name}
                      </IonCardTitle>
                      <IonCardSubtitle>
                        {new Date(act.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                        })}
                      </IonCardSubtitle>
                    </div>
                    {act.open ? (
                      <IonCardSubtitle style={{fontWeight: "bold", opacity: "1", color: "var(--ion-color-naranja)"}}>
                        {t('ACTIVIDAD.ESTADO.ABIERTO')}
                      </IonCardSubtitle>
                    ) : (
                      <IonCardSubtitle style={{fontWeight: "bold"}}>
                        {t('ACTIVIDAD.ESTADO.CERRADO')}
                      </IonCardSubtitle>
                    )}
                  </IonCardHeader>
                  <IonCardContent className='ion-margin-start'>
                    <div 
                      className='ion-margin-start'
                      style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                    >
                      {act.password}
                    </div>
                  </IonCardContent>
                </IonCard>
              </li>
            ))}
          </ul>
        </div>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setModalCrear(true)} color={'dark'}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <RoomCrearModal
          isOpen={modalCrear}
          setIsOpen={setModalCrear}
        />
      </IonContent>
    </IonPage>
  );
};

export default EvaluacionProfesor;