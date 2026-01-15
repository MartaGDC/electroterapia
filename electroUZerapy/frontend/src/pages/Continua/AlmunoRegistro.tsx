import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useUser } from '../../context/userContext';
import { registrarByCode } from '../../api/list';
import Logo from '../../components/Logo';


const AlumnoRegistro: React.FC = () => {
  const [present] = useIonToast();
  const {t} = useTranslation();
  const { codeQR } = useParams<{ codeQR: string }>();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isTouched, setIsTouched] = useState(false)
    
  const {login} = useUser();

  const handleRegister = async () => {
    setLoading(true);
    if (username == "" || password=="") {
      setIsTouched(true);
      return;
    }

    try {
      const loginRes = await login(username, password);
      if (loginRes.status !== 200) {
        present({ message: t('LOGIN.ERROR'), duration: 4000, cssClass: 'error-toast' });
        setLoading(false);
        setIsTouched(true);
        return;
      }
      setIsTouched(false);

      const userId = loginRes.data.user.id;
      const res = await registrarByCode(codeQR, userId);
      if (res.status === 200) {
        setIsTouched(false)
        present({ message: t('CONTINUA.REGISTRADO'), duration: 4000, cssClass: 'success-toast' });
      } else {
        setIsTouched(true);
        present({ message: t('CONTINUA.ALERTAS.ERROR_REGISTRO'), duration: 4000, cssClass: 'error-toast' });
      }
    } catch (error) {
      console.error(error);
      present({ message: t('CONTINUA.ALERTAS.ERROR_REGISTRO'), duration: 4000, cssClass: 'error-toast' });
      setIsTouched(true);
    }
    setLoading(false);
  };

  return (
    <IonPage className='ion-no-padding ion-no-margin'>
      <IonContent className='ion-no-padding ion-no-margin' fullscreen>
        <div className='ion-margin ion-padding' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h2 className='ion-no-padding ion-no-margin'>{t('LOGIN.INICIAR_SESION')}</h2>
          <Logo type="home"/>
          <IonRow style={{ width: '100%', maxWidth: '400px'}}>
            <IonInput
              className={`${isTouched && "ion-invalid ion-touched"} ion-margin`}
              value={username}
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
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
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              label={t("LOGIN.CONTRASENA")}
              type="password"
              placeholder={t("LOGIN.CONTRASENA_PLACEHOLDER")}
              labelPlacement="stacked"
              fill="outline"
              color={'dark'}
            />
          </IonRow>
          <IonButton onClick={handleRegister} disabled={loading}>
            {loading ? t('GENERAL.CARGANDO') : t('CONTINUA.REGISTRAR')}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AlumnoRegistro;