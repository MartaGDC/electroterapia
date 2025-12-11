import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonModal, IonTextarea, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserList } from '../../context/userListContext';
import { createRoom } from '../../api/room';
import TogglePicker from '../../components/Pickers/TogglePicker';

const RoomCrearModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  isOpen, setIsOpen
}) => {
  const { addUsers } = useUserList();
  const [present] = useIonToast();
  const {t} = useTranslation();

  const [isTouched, setIsTouched] = useState(false)
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(true);

  function generarCodigoAlfanumerico(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres[randomIndex];
    }
    return codigo;
  }

  const crearSala = async () => {
    setIsTouched(true);

    if (name == "" || password == "") return;
    const res = await createRoom({ name, password, description, open });

    setIsTouched(false);

    setIsOpen(false);
    location.reload();
  }
  
  const cerrarModal = () => {
    setIsOpen(false);
    setName("");
    setPassword("");
    setDescription("");
    setOpen(false);
  }

  useEffect(() => {
    if (isOpen) setPassword(generarCodigoAlfanumerico());
  }, [isOpen])

  return (
    <IonModal 
      className='modal-crear-alumno' 
      isOpen={isOpen}
      onIonModalDidDismiss={cerrarModal}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle> {t('ACTIVIDAD.TITLE')} </IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={cerrarModal}> 
              {t('ACTIVIDAD.CONFIRMAR')} 
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Nombre */}
        <IonInput
          className={`${name !== "" ? "" : "ion-invalid"} ${isTouched && "ion-touched"} ion-margin-top`}
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          label={t("ACTIVIDAD.NOMBRE.LABEL")}
          type="text"
          placeholder={t("ACTIVIDAD.NOMBRE.PH")}
          labelPlacement="stacked"
          fill="outline"
          color={'dark'}
          errorText={t("ACTIVIDAD.NOMBRE.PH")}
        />
        {/* Contraseña */}
        <IonInput
          className={`${password !== "" ? "" : "ion-invalid"} ${isTouched && "ion-touched"} ion-margin-top`}
          value={password}
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          label={t("ACTIVIDAD.CODIGO.LABEL")}
          placeholder={t("ACTIVIDAD.CODIGO.PH")}
          labelPlacement="stacked"
          fill="outline"
          color={'dark'}
          errorText={t("ACTIVIDAD.CODIGO.PH")}
          disabled={true}
        />

        {/* Descripción */}
        <IonTextarea
          className='ion-margin-top'
          autoGrow={true}
          value={description}
          onInput={(e) => setDescription((e.target as HTMLInputElement).value)}
          fill='outline'
          labelPlacement='stacked'
          label={t('ACTIVIDAD.DESCRIPCION.LABEL')}
          placeholder={t('ACTIVIDAD.DESCRIPCION.PH')}
          color={'dark'}
          style={{ width: "100%", "--border-color": "var(--ion-color-primary)"}}
        />

        {/* Abierto */}
        <TogglePicker
          variable={open}
          onChange={() => setOpen(!open)}
          name={t('ACTIVIDAD.ESTADO.LABEL')}
          msgTrue={t('ACTIVIDAD.ESTADO.ABIERTO')}
          msgFalse={t('ACTIVIDAD.ESTADO.CERRADO')}
        />

        <IonButton className='button-crear-alumno' onClick={crearSala}>
          {t('ALUMNOS.BUTTON')}
        </IonButton>

      </IonContent>
    </IonModal>
  );
};

export default RoomCrearModal;