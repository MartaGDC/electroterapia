import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonNote, IonPage, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import { languageOutline, lockClosedOutline, personCircleOutline, personOutline, repeat, settingsOutline, statsChartOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import './Ajustes.css';
import { useTranslation } from 'react-i18next';
import ListPicker from '../../components/Pickers/ListPicker';
import { useUser } from '../../context/userContext';

const Ajustes: React.FC = () => {
  const {t, i18n} = useTranslation();
  const router = useIonRouter();
  const [option, setOption] = useState(0);

  const {user} = useUser();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const {changePassword} = useUser();
  const [present] = useIonToast();



  const lngs = [
    { name: "🇪🇸 Español", value: "es", disabled: false },
    { name: "🇬🇧 Inglés", value: "en", disabled: false}
  ];

  const navigateButton = (path: any) => {
    router.push(path);
  }

  const doChangePassword = async (event:any) => {
    event?.preventDefault();

    if (oldPassword=='' || newPassword=='' || repeatPassword=='') {
      setIsTouched(true);
      return;
    }

    try {
      const response = await changePassword(user.id, oldPassword, newPassword);
      if (response.status === 200) {
        setOldPassword('');
        setNewPassword('');
        setRepeatPassword('');
        setIsTouched(false);
        present({ message: t("AJUSTES.CONTRASENA.CAMBIADO"), duration: 4000})
      } else {
        console.log("error");
        setIsTouched(true);
      }          
    } catch (error) {
      console.log("error");
      setIsTouched(true);
    }
  }

  return (
    <IonPage>
      <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={settingsOutline}/>
            <IonTitle> {t('MENU.AJUSTES')} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content  ion-justify-content-center'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          <IonCol size='6' className='col-ajustes ion-no-padding ion-no-margin'>
            <IonContent>
              <div>
                <IonIcon className='perfil' icon={personCircleOutline} />
                <h1>{user?.name}</h1>
                <IonList className='lista-ajustes' >
                  <IonItem onClick={() => setOption(0)} lines='full' button={true}>
                    <IonIcon aria-hidden="true" slot='start' icon={lockClosedOutline} />
                    <IonLabel> {t('AJUSTES.CONTRASENA.CONTRASENA')} </IonLabel>
                  </IonItem>
                  <IonItem onClick={() => setOption(1)} lines='full' button={true}>
                    <IonIcon aria-hidden="true" slot='start' icon={languageOutline} />
                    <IonLabel> {t('AJUSTES.IDIOMA.IDIOMA')} </IonLabel>
                  </IonItem>
                </IonList>
              </div>
            </IonContent>
          </IonCol>
          <IonCol size='6' className='ion-padding ion-no-margin'>
            <IonContent>
              {option == 0 ? (
                <div className='ion-padding-end'>
                  <form className="" onSubmit={doChangePassword}>
                    <h2 className='cambio-title ion-margin-start ion-margin-top ion-no-margin'> 
                      {t('AJUSTES.CONTRASENA.CAMBIO')} 
                    </h2>
                    <IonInput
                      className={`${isTouched && "ion-invalid ion-touched"} ajustes-input ion-margin-start ion-margin-top`}
                      label={t("AJUSTES.CONTRASENA.ACTUAL")}
                      value={oldPassword}
                      onInput={(e) => setOldPassword((e.target as HTMLInputElement).value)}
                      type="password"
                      placeholder={t("AJUSTES.CONTRASENA.ACTUAL_PH")}
                      labelPlacement="stacked"
                      fill="solid"
                      color={'dark'}
                    />
                    <IonInput
                      className={`${isTouched && "ion-invalid ion-touched"} ajustes-input ion-margin-start ion-margin-top`}
                      label={t("AJUSTES.CONTRASENA.NUEVA")}
                      value={newPassword}
                      onInput={(e) => setNewPassword((e.target as HTMLInputElement).value)}
                      type="password"
                      placeholder={t("AJUSTES.CONTRASENA.NUEVA_PH")}
                      labelPlacement="stacked"
                      fill="solid"
                      color={'dark'}
                    />
                    <IonInput
                      className={`${isTouched && "ion-invalid ion-touched"} ajustes-input ion-margin-start ion-margin-top`}
                      label={t("AJUSTES.CONTRASENA.REPETIR")}
                      value= {repeatPassword}
                      onInput = {(e) => setRepeatPassword((e.target as HTMLInputElement).value)}
                      type="password"
                      placeholder={t("AJUSTES.CONTRASENA.REPETIR_PH")}
                      labelPlacement="stacked"
                      fill="solid"
                      color={'dark'}
                    />
                    <IonButton
                      className="passwd-button ion-margin-start ion-no-margin ion-margin-top"
                      expand="block"
                      type="submit"
                    >
                      {t("AJUSTES.CONTRASENA.BUTTON")}
                    </IonButton>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className='cambio-title ion-margin-start ion-margin-top ion-no-margin'> 
                    {t('AJUSTES.IDIOMA.IDIOMA')} 
                  </h2>
                  <ListPicker
                    variable={i18n.resolvedLanguage}
                    onChange={i18n.changeLanguage}
                    label={t('AJUSTES.IDIOMA.IDIOMA')}
                    placeholder={t('AJUSTES.IDIOMA.IDIOMA_PH')}
                    valueOptions={lngs}
                  />
                </div>
              )}
            </IonContent>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Ajustes;