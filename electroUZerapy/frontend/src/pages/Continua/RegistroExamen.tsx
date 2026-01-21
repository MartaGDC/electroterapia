import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useUser } from '../../context/userContext';
import Logo from '../../components/Logo';
import { crearTestAleatorio } from '../../api/test';


const RegistroExamen: React.FC = () => {
  const [present] = useIonToast();
  const {t} = useTranslation();
  const { codeQR } = useParams<{ codeQR: string }>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isTouched, setIsTouched] = useState(false)

  const router = useIonRouter();
    
  const {login} = useUser();

  const crearTestCorregido = async (id: string) => {
    const res = await crearTestAleatorio(codeQR, id);
    if (res.status === 200) {
      return res.data.quizId;
    } else {
      present({ message: t('CONTINUA.ALERTA.ERROR_CREAR_TEST'), duration: 4000, cssClass: "error-toast" });
      return null;
    }
  };

  const navigateExamen = async () => {
    if (username == "" || password=="") {
      setIsTouched(true);
      return;
    }

    try {
      const loginRes = await login(username, password);
      const userId = loginRes.data.user.id;
      const testCorregidoId = await crearTestCorregido(userId);
      console.log("Test corregido ID:", testCorregidoId);
      if (testCorregidoId)
        router.push(`/app/alumnoTest/${testCorregidoId}`, 'root', 'replace');
      
    } catch (error: any) {
      const mensaje = error?.response?.data?.message;
      present({ message:  mensaje, duration: 4000, cssClass: 'error-toast' });
      setIsTouched(true);
    }
  };

  return (
    <IonPage className='ion-no-padding ion-no-margin'>
      <IonContent className='ion-no-padding ion-no-margin' fullscreen>
        <div className='ion-margin ion-padding' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h1 className='ion-padding-top ion-no-margin'>{t('CONTINUA.ACCESO_TEST')}</h1>
          <Logo type="register"/>
          <IonRow className='ion-padding-top' style={{ width: '100%', maxWidth: '400px'}}>
            <IonInput
              className={`${isTouched && "ion-invalid ion-touched"} ion-margin`}
              value={username}
              onIonInput={(e) => setUsername(e.detail.value!)}
              label={t("LOGIN.USUARIO")}
              type="text"
              placeholder={t('LOGIN.USUARIO_PLACEHOLDER')}
              labelPlacement="stacked"
              fill="outline"
              color={'dark'}
            />
          </IonRow>
          <IonRow style={{ width: '100%', maxWidth: '400px'}}>
            <IonInput
              className={`${isTouched && "ion-invalid ion-touched"} ion-margin`}
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
              label={t("LOGIN.CONTRASENA")}
              type="password"
              placeholder={t("LOGIN.CONTRASENA_PLACEHOLDER")}
              labelPlacement="stacked"
              fill="outline"
              color={'dark'}
            />
          </IonRow>
          <IonButton className= "log-button ion-margin-top" strong={true} onClick={navigateExamen}>
            {t('CONTINUA.ACCEDER')}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegistroExamen;