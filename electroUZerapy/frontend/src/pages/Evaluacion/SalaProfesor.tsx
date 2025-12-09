import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SalaProfesor.css'
import constants from '../../constants/constants';
import { deleteRoom, getRoomById, updateRoom } from '../../api/room';
import { useParams } from 'react-router';
import { Room } from '../../constants/interfaces';
import { copyOutline } from 'ionicons/icons';
import { copyToClipboard } from '../../components/Logica/General';
import TooglePicker from '../../components/Pickers/TogglePicker';

const SalaProfesor: React.FC = () => {
  const [present] = useIonToast();
  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();

  const {t} = useTranslation();
  const [isOpenAlertEliminar, setIsOpenAlertEliminar] = useState(false);

  const [room, setRoom] = useState<Room>();

  const [name, setName] = useState("");
  const [estado, setEstado] = useState(false);
  const [description, setDescription] = useState("");

  const copyText = async (text: string) => {
    const exito = await copyToClipboard(text);
    if (exito) present({ message: t('ACTIVIDAD.CODIGO.COPIADO'), duration: 4000, cssClass: "success-toast" });
  }

  const guardarSala = async () => {
    const res = await updateRoom({roomId: id, name, open: estado, description});

    if (res.status === 200) {
      present({ message: t('ACTIVIDAD.CAMBIADA'), duration: 4000, cssClass: "success-toast" });
    } else {
      present({ message: t('ACTIVIDAD.ERROR_CAMBIO'), duration: 4000, cssClass: "error-toast" });
    }
  }

  const eliminarSala = async () => {
    const res = await deleteRoom({ roomId: id });

    if (res.status === 200) {
      router.push("/app/evaluacionProfesor", "back", "replace")
    }
  }

  const navigateButton = (id: string) => {
    router.push("/app/visualizadorLog/" + id, "forward", "push");
  }

  useEffect(() => {
    const getRoom = async () => {
      const res = await getRoomById(id);

      console.log(res)
      if (res.status == 200){
        setRoom(res.data.room);
        setName(res.data.room.name);
        setEstado(res.data.room.open);
        setDescription(res.data.room.description);
      }
    }
    getRoom();
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
        <IonRow>
          <IonCol className='ion-padding-start' size='8'>
            <h2 
              className='ion-margin-top ion-no-margin ion-margin-start'
              style={{marginLeft: "5px"}}
            > 
              {t("ACTIVIDAD.RESPUESTAS")} 
            </h2>
            <div className='lista-evaluacion-container'>
              <ul className='ion-no-padding ion-no-margin'>
                {room && room.logs.map((act, idx) => (
                  <li className='ion-no-margin' key={idx}>
                    <IonCard className='ion-no-margin' onClick={() => navigateButton(act.logId)}>
                      <IonCardHeader className='ion-no-padding'>
                        <IonCardTitle className='ion-no-margin ion-text-start'> 
                            {act.userName}
                        </IonCardTitle>
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
          <IonCol size='4' className='ion-no-margin'>
            <h2 style={{marginLeft: "0"}} className='ion-no-margin ion-margin-top ion-margin-bottom'> 
              {t("ACTIVIDAD.DETALLES")} 
            </h2>

            {/* Nombre */}
            <IonItem className='ion-no-padding' lines='none'>
              <IonInput
                className='disabled-visible ion-margin-top'
                value={name}
                onInput={(e) => setName((e.target as HTMLInputElement).value)}
                label={t("ACTIVIDAD.NOMBRE.LABEL")}
                type="text"
                labelPlacement="stacked"
                fill="outline"
                color={'dark'}
              />
            </IonItem>
            
            {/* Código */}
            <IonItem className='ion-no-padding' lines='none'>
              <IonInput
                className='disabled-visible ion-margin-top'
                value={room?.password}
                label={t("ACTIVIDAD.CODIGO.LABEL")}
                type="text"
                labelPlacement="stacked"
                disabled
                fill="outline"
                color={'dark'}
              >
                <IonButton 
                  className='disabled-visible'
                  fill='clear'
                  slot='end'
                  onClick={() => room?.password && copyText(room?.password)}
                >
                  <IonIcon slot="icon-only" aria-hidden="true" src={copyOutline} />
                </IonButton>
              </IonInput>
            </IonItem>

            {/* Estado: abierto / cerrado */}
            <div className='ion-padding-end'>
              <TooglePicker
                variable={estado}
                onChange={() => setEstado(!estado)}
                name={t('ACTIVIDAD.ESTADO.LABEL')}
                msgTrue={t('ACTIVIDAD.ESTADO.ABIERTO')}
                msgFalse={t('ACTIVIDAD.ESTADO.CERRADO')}
              />
            </div>
            
            {/* Descripción */}
            <IonItem className='ion-no-padding' style={{"--height": "200px"}} lines='none'>
              <IonTextarea
                className='disabled-visible ion-margin-top'
                value={description}
                onInput={(e) => setDescription((e.target as HTMLInputElement).value)}
                fill='outline'
                labelPlacement='stacked'
                label={t('ACTIVIDAD.DESCRIPCION.LABEL')}
                color={'dark'}
                autoGrow
                style={{ "--height": "200px", width: "100%", "--border-color": "var(--ion-color-primary)"}}
              />
            </IonItem>

            {/* Botón de guardar */}
            <IonButton className='ion-margin-end' onClick={guardarSala} style={{display: "block"}}>
              {t('ACTIVIDAD.GUARDAR')}
            </IonButton>

            {/* Botón de guardar */}
            <IonButton 
              color={'danger'} 
              className='ion-margin-end' 
              onClick={() => setIsOpenAlertEliminar(true)}
              style={{display: "block"}}
            >
              {t('ACTIVIDAD.ELIMINAR')}
            </IonButton>

            <IonAlert
              isOpen={isOpenAlertEliminar}
              onDidDismiss={() => setIsOpenAlertEliminar(false)}
              //trigger="create-students"
              header={t('ACTIVIDAD.ALERT_ELIMINAR.HEADER')}
              subHeader={t('ACTIVIDAD.ALERT_ELIMINAR.SUBHEADER')}
              message={t('ACTIVIDAD.ALERT_ELIMINAR.MSG')}
              buttons={[{
                text: 'Eliminar',
                role: 'confirm',
                handler: async () => {
                  await eliminarSala();
                }
              }]}
            />


          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default SalaProfesor;