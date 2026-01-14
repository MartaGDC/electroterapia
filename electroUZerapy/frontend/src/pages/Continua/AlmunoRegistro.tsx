import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonRow,
  IonCol,
  useIonToast
} from '@ionic/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../context/userContext';
import { registrarByCode } from '../../api/list';

interface AlumnoRegistroProps {
  codeQR: string;
}

const AlumnoRegistro: React.FC<AlumnoRegistroProps> = ({ codeQR }) => {
  const { t } = useTranslation();
  const { login } = useUser();
  const [present] = useIonToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Hacer login siempre, aunque haya token
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