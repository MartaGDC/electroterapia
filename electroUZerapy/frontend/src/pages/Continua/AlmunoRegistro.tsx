import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useUser } from '../../context/userContext';
import { registrarByCode } from '../../api/list';

const AlumnoRegistro: React.FC = () => {
  const [present] = useIonToast();
  const {t} = useTranslation();
  const { codeQR } = useParams<{ codeQR: string }>();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useUser();

  console.log('AlumnoRegistro montado con codeQR:', codeQR);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const loginRes = await login(username, password);
      if (loginRes.status !== 200) {
        present({ message: t('LOGIN.ERROR'), duration: 4000, cssClass: 'error-toast' });
        setLoading(false);
        return;
      }

      // Registrar asistencia
      const res = await registrarByCode(codeQR);
      if (res.status === 200) {
        present({ message: t('CONTINUA.REGISTRADO'), duration: 4000, cssClass: 'success-toast' });
      } else {
        present({ message: t('CONTINUA.ALERTAS.ERROR_REGISTRO'), duration: 4000, cssClass: 'error-toast' });
      }
    } catch (error) {
      console.error(error);
      present({ message: t('CONTINUA.ALERTAS.ERROR_REGISTRO'), duration: 4000, cssClass: 'error-toast' });
    }
    setLoading(false);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2>{t('LOGIN.INICIAR_SESION')}</h2>
          <IonRow>
            <IonCol>
              <IonInput
                placeholder={t('LOGIN.USUARIO')}
                value={username}
                onIonInput={(e) => setUsername(e.detail.value!)}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput
                type="password"
                placeholder={t('LOGIN.CONTRASENA')}
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
              />
            </IonCol>
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