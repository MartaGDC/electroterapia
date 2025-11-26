import { IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonMenuButton, IonModal, IonPage, IonPopover, IonRow, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import "./AlumnosCrearModal.css"
import { useUserList } from '../../context/userListContext';
import SubidaFichero from './SubidaFichero';
import { informationCircleOutline } from 'ionicons/icons';

const AlumnosCrearModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  isOpen, setIsOpen
}) => {
  const [present] = useIonToast();
  const { addUsers } = useUserList();
  const {t} = useTranslation();
  const [nipAlumno, setNipAlumno] = useState("");
  const [nipProfesor, setNipProfesor] = useState("");

  const crearUsuario = async () => {
    const res = await addUsers([{ name: nipAlumno, password: nipAlumno, role: "student"}]);
    if (res.length == 0) {
      present({message: t('ALUMNOS.ALERTAS.USUARIO_OK'), duration: 4000, cssClass: "success-toast"});
    } else {
      present({message: t('ALUMNOS.ALERTAS.USUARIO_ERROR'), duration: 4000, cssClass: "error-toast"});
    }
  }

  const crearProfesor = async () => {
    const res = await addUsers([{ name: nipProfesor, password: nipProfesor, role: "teacher"}]);
    if (res.length == 0) {
      present({message: t('ALUMNOS.ALERTAS.USUARIO_OK'), duration: 4000, cssClass: "success-toast"});
    } else {
      present({message: t('ALUMNOS.ALERTAS.USUARIO_ERROR'), duration: 4000, cssClass: "error-toast"});
    }
  }

  const cerrarModal = () => {
    setIsOpen(false);
    setNipAlumno("");
    setNipProfesor("");
  }

  return (
    <IonModal 
      className='modal-crear-alumno' 
      isOpen={isOpen}
      onIonModalDidDismiss={cerrarModal}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle> {t('ALUMNOS.CREAR')} </IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={cerrarModal}> 
              {t('ALUMNOS.CONFIRMAR')} 
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          <IonCol size='5' className='ion-margin'>
            
            <h3> {t('ALUMNOS.UNICO.TITLE')} </h3>
            <IonInput
              className='ion-margin-top'
              value={nipAlumno}
              onInput={(e) => setNipAlumno((e.target as HTMLInputElement).value)}
              label={t("ALUMNOS.UNICO.LABEL")}
              type="text"
              placeholder={t("ALUMNOS.UNICO.PH")}
              labelPlacement="stacked"
              fill="outline"
              color={'dark'}
            />
            <IonButton className='button-crear-alumno' onClick={crearUsuario}>
              {t('ALUMNOS.BUTTON')}
            </IonButton>

            <h3> {t('ALUMNOS.PROFESOR.TITLE')} </h3>
            <IonInput
              className='ion-margin-top'
              value={nipProfesor}
              onInput={(e) => setNipProfesor((e.target as HTMLInputElement).value)}
              label={t("ALUMNOS.PROFESOR.LABEL")}
              type="text"
              placeholder={t("ALUMNOS.PROFESOR.PH")}
              labelPlacement="stacked"
              fill="outline"
              color={'dark'}
            />
            <IonButton className='button-crear-alumno' onClick={crearProfesor}>
              {t('ALUMNOS.BUTTON')}
            </IonButton>


          </IonCol>
          <IonCol size='5' className='ion-margin'>
            <h3 style={{display: "flex", alignItems: "center"}}> 
              {t('ALUMNOS.VARIOS.TITLE')} 
              <IonIcon 
                className='info'
                id='info-fichero'
                color={'secondary'} 
                src={informationCircleOutline}
              />
              <IonPopover trigger='info-fichero' triggerAction='click'>
                <p className='ion-padding'>
                  El fichero debe tener el siguiente formato por línea: <strong>NIP;</strong>
                </p>
              </IonPopover>

            </h3>
            <SubidaFichero/>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonModal>
  );
};

export default AlumnosCrearModal;