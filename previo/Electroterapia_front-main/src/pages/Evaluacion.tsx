import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonMenuButton, IonModal, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Evaluacion.css'
import constants from '../constants/constants';
import { RoomStudent } from '../constants/interfaces';
import { enterRoom, getAllRoomsStudent } from '../api/room';
import { useLog } from '../context/logContext';

const Evaluacion: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();
  const {t} = useTranslation();
  const { establecerActividad } = useLog();

  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [actividadSelected, setActividadSelected] = useState<RoomStudent | null>(null)
  const [actividades, setActividades] = useState<RoomStudent[]>([]);

  const navigateButton = (path: any) => {
    event?.preventDefault();
    router.push(path);
  };

  const stats = [
    { name: "NOTA_MEDIA", data: 9.45 },
    { name: "MEJOR_NOTA", data: 10 },
    { name: "PEOR_NOTA", data: 8.3 },
    { name: "ACTIVIDADES_REALIZADAS", data: 8.3 },
    { name: "ACTIVIDADES_CORREGIDAS", data: 8.3 },
    { name: "ACTIVIDADES_APROBADAS", data: 8.3 },
    { name: "ACTIVIDADES_SUSPENDIDAS", data: 8.3 },
  ];

  const empezarEvaluacion = (room: RoomStudent) => {
    if (room.mark != null) {
      // Si el usuario ya ha realizado la simulación, no se permite empezar una 
      // nueva simulación
      present({message: t('ACTIVIDAD.ERROR.REALIZADA'), duration: 4000, cssClass: "error-toast"})
    } else if (!room.open) {
      // Si la sala está cerrada o el usuario ya ha realizado la simulación, no
      // se permite empezar una nueva simulación
      present({message: t('ACTIVIDAD.ERROR.CERRADA'), duration: 4000, cssClass: "error-toast"})
    } else {
      setActividadSelected(room);
      setIsOpen(true);
    }
  }

  const confirmarPassword = async () => {
    if (actividadSelected !== null) {
      const res = await enterRoom({ roomId: actividadSelected?._id, password });

      if (res.status == 200) {
        console.log("Entramos", actividadSelected)
        setIsOpen(false);
        establecerActividad(actividadSelected);
        router.push("/app/evaluacion/actividad", "root", "replace");  
      }  
    }
  }

  useEffect(() => {
    const getActividades = async () => {
      const res = await getAllRoomsStudent();
      console.log(res.data.rooms)
      if (res.status == 200) setActividades(res.data.rooms)
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

      <IonContent className='content-aprendizaje' fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol className='ion-no-margin ion-margin-end'>
              <h2 style={{marginLeft: "10px"}} className='ion-margin-top ion-margin-start ion-no-margin'> 
                {t("EVALUACION.ACTIVIDADES")} 
              </h2>

              <div className='lista-evaluacion-container'>
                <ul className='ion-no-padding ion-no-margin'>
                  {actividades && actividades.map((act, idx) => (
                    <li className='ion-no-margin' key={idx}>
                      <IonCard className='ion-no-margin' onClick={() => empezarEvaluacion(act)}>
                        <IonCardHeader className='ion-no-padding'>
                          <div 
                            className='ion-margin-end ion-padding-end'
                            style={{
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "center"
                            }}
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
                        <IonCardContent className='ion-no-margin'>
                          <div 
                            className='ion-margin-end ion-padding-end'
                            style={{
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "center",
                            }}
                          >
                            <p 
                              className='ion-no-margin' 
                              style={{
                                width: "100%", 
                                textAlign: "end",
                                fontWeight: "bold"
                              }}
                            >
                              {act.mark == null 
                                ? t('ACTIVIDAD.NOTA.NO_REALIZADA') 
                              : act.mark == -1 
                                ? t('ACTIVIDAD.NOTA.SIN_CALIFICAR') 
                              : act.mark}
                            </p>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </li>
                  ))}
                </ul>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonModal
          isOpen={isOpen}
          onIonModalDidDismiss={() => setIsOpen(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle> {t('ACTIVIDAD.MODAL_ENTRAR.TITLE')} </IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => setIsOpen(false)}>
                  {t('ACTIVIDAD.MODAL_ENTRAR.CANCELAR')} 
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className='ion-padding'>
            <IonInput
              className='ion-margin-top'
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              label={t('ACTIVIDAD.CODIGO.LABEL')}
              placeholder={t('ACTIVIDAD.CODIGO.PH')}
              labelPlacement="stacked"
              fill="outline"
              color={'dark'}    
            />
            <IonButton onClick={confirmarPassword} style={{ width: "100%" }}>
              {t('ACTIVIDAD.MODAL_ENTRAR.ENTRAR')}
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Evaluacion;