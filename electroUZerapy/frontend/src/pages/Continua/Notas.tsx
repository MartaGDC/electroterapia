//Donde se mostrarán el resgistro de todas las asistencias

import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import constants from '../../constants/constants';
import { getAllLists } from '../../api/list';
import { List } from '../../constants/interfaces';
import './SalaListados.css';

const Notas: React.FC = () => {
    const {t} = useTranslation();
        const [lists, setLists] = useState<List[]>([]);
    
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
        <IonContent className='content-listados' fullscreen>
            <IonCol>
                <h2 className='ion-padding ion-margin' style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                    {t("CONTINUA.LISTA")}:
                </h2>
                <IonGrid className="ion-padding ion-margin">
                    <IonRow className="ion-margin-start ion-padding-start ion-margin-end ion-padding-end" style={{background: 'var(--ion-color-primary)', color: 'white', borderRadius: '10px'}}>
                        <IonCol className="ion-text-center table-header"><h3>Usuario</h3></IonCol>
                        <IonCol className="ion-text-center table-header"><h3>Asistencias</h3></IonCol>
                        <IonCol className="ion-text-center table-header"><h3>Faltas</h3></IonCol>
                        <IonCol className="ion-text-center table-header"><h3>Total</h3></IonCol>
                        <IonCol className="ion-text-center table-header"></IonCol>
                    </IonRow>
                    
                    
                </IonGrid>
            </IonCol>
        </IonContent>
    </IonPage>
    );
};

export default Notas;