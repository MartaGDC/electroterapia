import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React, { useState } from 'react';
import "./Login.css"
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/userContext';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const {login} = useUser();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isTouched, setIsTouched] = useState(false)

  const libre = true
  // const doLogin = (event: any) => {
  //   event?.preventDefault();
  //   router.push("/app/home");
  // }

  const doLogin = async (event: any) => {
    
    event?.preventDefault();
    
    if (libre) {
      router.push("/app/home");
    } else {
      if (name == "" || password == "") {
        setIsTouched(true);
        return;
      }

      try {
        const response = await login(name, password);
        if (response.status === 200) {
          router.push("/app/home", "root", "replace");
          setIsTouched(false);
        } else {
          console.log("error");
          setIsTouched(true);
        }          
      } catch (error) {
        console.log("error");
        setIsTouched(true);
      }
    }
  }

  return (
    <IonPage className='ion-no-padding ion-no-margin'>
      <IonContent className='ion-no-padding ion-no-margin' fullscreen>
        <IonRow 
         style={{display: "flex"}} 
         className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size='6.5' className='titulo-login-container ion-no-padding ion-no-margin'>
            <Logo type="login" />
          </IonCol>
          {/* Parte derecha */}
          <IonCol className='ion-no-padding ion-no-margin'>
            <IonContent className='ion-no-margin'>
              <IonRow
                style={{
                  height: "100%", 
                  display: "flex",
                  flexDirection: "column"
                }} 
                className='form-container ion-align-items-center ion-justify-content-center'
              >
                <form className="login-form" onSubmit={doLogin}>
                  <h1 className='inicio-sesion ion-text-start'> 
                    {t("LOGIN.INICIAR_SESION")} 
                  </h1>
                  <IonInput
                    className={`${isTouched && "ion-invalid ion-touched"} ion-margin-top`}
                    value={name}
                    onInput={(e) => setName((e.target as HTMLInputElement).value)}
                    label={t("LOGIN.USUARIO")}
                    type="text"
                    placeholder={t("LOGIN.USUARIO_PLACEHOLDER")}
                    labelPlacement="stacked"
                    fill="outline"
                    color={'dark'}
                    errorText={t("LOGIN.ERROR")}
                  />
                  <IonInput
                    className={`${isTouched && "ion-invalid ion-touched"} ion-margin-top`}
                    value={password}
                    onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                    label={t("LOGIN.CONTRASENA")}
                    type="password"
                    placeholder={t("LOGIN.CONTRASENA_PLACEHOLDER")}
                    labelPlacement="stacked"
                    fill="outline"
                    color={'dark'}
                    errorText={t("LOGIN.ERROR")}
                  />
                  <IonButton
                    className="login-button ion-margin-top"
                    expand="block"
                    type="submit"
                  >
                    {t("LOGIN.BUTTON")}
                  </IonButton>
                </form>
              </IonRow>
            </IonContent>
          </IonCol>
        </IonRow>  
    </IonContent>
  </IonPage>

  );
};

export default Login;