import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './EvaluacionContinua.css'
import constants from '../constants/constants';
import { List } from '../constants/interfaces';
import { getAllLists } from '../api/list';

import QRClass from "./Continua/QRClass";



const Continua: React.FC = () => {
  const {t} = useTranslation();
  const router = useIonRouter();

  const [listados, setListados] = useState<List[]>([]);
  const [qrVisible, setQrVisible] = useState(false);

  const navigateListado = (id: string) => {
    event?.preventDefault();
    router.push(`/app/salaListados/${id}`, 'root', 'replace');
  }
  
  useEffect(() => {
    const getListados = async () => {
      const res = await getAllLists();
      if (res.status == 200) {
        setListados(res.data.lists);
      }
    };
    getListados();
  }, []);

  return (
    <IonPage>
      <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={constants.continuaIcon}/>
            <IonTitle> {t("MENU.CONTINUA")} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding' fullscreen>
        <div className="lista-student-container">
          <h2 className='ion-margin-top ion-margin-start ion-no-margin'> 
            {t("CONTINUA.LISTAS")} 
          </h2>
          <IonFabButton onClick={() => setQrVisible(true)} color={'dark'} className='ion-margin-top ion-margin-start ion-no-margin'>
              <IonIcon icon={add} ></IonIcon>
          </IonFabButton>
        </div>
        <QRClass
        isVisible={qrVisible}
        setIsVisible={setQrVisible}
        />

        <div className='lista-list-container'>
          <ul className='ion-no-padding ion-no-margin'>
            {listados.map((list, idx) => (
            <li className='ion-no-margin' key={idx}>
              <IonCard className='ion-no-margin' onClick={() => navigateListado(list._id)}>
                <IonCardHeader className='ion-no-padding'>
                  <div 
                    className='ion-padding-end'
                    style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                  >
                    <IonCardTitle className='ion-no-margin ion-text-start'>
                      {new Date(list.start).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </IonCardTitle>
                  </div>
                  {list.isOpen ? (
                    <IonCardSubtitle style={{fontWeight: "bold", opacity: "1", color: "var(--ion-color-naranja)"}}>
                      {t('CONTINUA.ESTADO.ABIERTO')}
                    </IonCardSubtitle>
                  ) : (
                    <IonCardSubtitle style={{fontWeight: "bold"}}>
                      {t('CONTINUA.ESTADO.CERRADO')}
                    </IonCardSubtitle>
                  )}
                </IonCardHeader>
                <IonCardContent className='ion-margin-start'>
                  <div 
                    className='ion-margin-start'
                    style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                  >
                    {list.asistentes.length}
                  </div>
                </IonCardContent>                
              </IonCard>
            </li>
            ))}
          </ul>
        </div>

        <div className="lista-student-container ion-margin-top"></div>
        <div className="lista-student-container ion-margin-top"></div>
        <div className="lista-student-container">
          <h2 className='ion-margin-top ion-margin-start ion-no-margin'> 
            {t("CONTINUA.KAHOOT")} 
          </h2>
          <IonFabButton color={'dark'} className='ion-margin-top ion-margin-start ion-no-margin'>
              <IonIcon icon={add} ></IonIcon>
          </IonFabButton>
        </div>
        <div className='lista-list-container'>
          <ul className='ion-no-padding ion-no-margin'>
            {listados.map((list, idx) => (
            <li className='ion-no-margin' key={idx}>
              <IonCard className='ion-no-margin' onClick={() => navigateListado(list._id)}>
                <IonCardHeader className='ion-no-padding'>
                  <div 
                    className='ion-padding-end'
                    style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                  >
                    <IonCardTitle className='ion-no-margin ion-text-start'>
                      {new Date(list.start).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </IonCardTitle>
                  </div>
                  {list.isOpen ? (
                    <IonCardSubtitle style={{fontWeight: "bold", opacity: "1", color: "var(--ion-color-naranja)"}}>
                      {t('CONTINUA.ESTADO.ABIERTO')}
                    </IonCardSubtitle>
                  ) : (
                    <IonCardSubtitle style={{fontWeight: "bold"}}>
                      {t('CONTINUA.ESTADO.CERRADO')}
                    </IonCardSubtitle>
                  )}
                </IonCardHeader>
                <IonCardContent className='ion-margin-start'>
                  <div 
                    className='ion-margin-start'
                    style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                  >
                    {list.asistentes.length}
                  </div>
                </IonCardContent>                
              </IonCard>
            </li>
            ))}
          </ul>
        </div>

        
      </IonContent>
    </IonPage>
  );
};

export default Continua;