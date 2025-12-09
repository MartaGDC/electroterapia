import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './EvaluacionContinua.css'
import constants from '../constants/constants';


const Continua: React.FC = () => {
  const {t} = useTranslation();
  const router = useIonRouter();

  const [listados, setListados] = useState([]);

  const navigateListado = (id: string) => {
      event?.preventDefault();
      router.push(`/app/listados/${id}`, 'root', 'replace');
    }
  
    useEffect(() => {
      const getListados = async () => {
        /*const res = await getAllLists();
  
        if (res.status == 200) {
          setListados(res.data.rooms)
        }*/
      }
  
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
            <IonFabButton color={'dark'}>
                <IonIcon icon={add}></IonIcon>
            </IonFabButton>
        </div>

        <div className='lista-ev-prof-container'>
            <ul className='ion-no-padding ion-no-margin'>
            {listados.map((list, idx) => (
                <li className='ion-no-margin' key={idx}>
                    <IonCard className='ion-no-margin' onClick={() => navigateListado(list._id)}>
                        <IonCardHeader className='ion-no-padding'>
                            <div 
                            className='ion-padding-end'
                            style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                            >
                                <IonCardTitle>
                                    {new Date(list.date).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                    })}
                                </IonCardTitle>
                            </div>
                        </IonCardHeader>
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