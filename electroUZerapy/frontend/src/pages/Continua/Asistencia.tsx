//Donde se mostrarán el resgistro de todas las asistencias

import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import constants from '../../constants/constants';
import { getAllLists } from '../../api/list';
import { List } from '../../constants/interfaces';
import './SalaListados.css';

const Asistencia: React.FC = () => {
    const {t} = useTranslation();
    const [lists, setLists] = useState<List[]>([]);

    useEffect(() => {
        const getLists = async () => {
            const res = await getAllLists();
            if (res.status === 200){
                setLists(res.data.lists);
            }
        };
        getLists();
    }, []);

const numLists = lists?.length;
const asistenciaStats = Object.values(lists.reduce((acum, list) => {
    list.asistentes.forEach((user) => {
      if (!acum[user._id]) {
        acum[user._id] = {
          userId: user._id,
          name: user.name,
          asiste: 0
        };
      }
      acum[user._id].asiste += 1;
    });
    return acum;
  }, {} as Record<string, {userId: string, name: string, asiste: number}>)
).map(user => ({
  ...user,
  falta: numLists - user.asiste
}));




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
                        <IonCol className="ion-text-center table-header"><h3>{t("LOGIN.USUARIO")}</h3></IonCol>
                        <IonCol className="ion-text-center table-header"><h3>{t("CONTINUA.ASISTENCIA")}</h3></IonCol>
                        <IonCol className="ion-text-center table-header"><h3>{t("CONTINUA.AUSENCIA")}</h3></IonCol>
                        <IonCol className="ion-text-center table-header"><h3>{t("CONTINUA.TOTAL")}</h3></IonCol>
                        <IonCol className="ion-text-center table-header"></IonCol>
                    </IonRow>
                    {asistenciaStats.map((user, idx) => (
                    <IonRow className="ion-margin-start ion-margin-top ion-padding-start ion-margin-end ion-padding-end" key={idx}>
                        <IonCol className="ion-text-center">{user.name}</IonCol>
                        <IonCol className="ion-text-center">{user.asiste}</IonCol>
                        <IonCol className="ion-text-center">{user.falta}</IonCol>
                        <IonCol className="ion-text-center">{numLists}</IonCol>
                        <IonCol className="ion-text-center">
                            {numLists > 0 ? ((user.asiste / numLists) * 100).toFixed(2) : '0.00'} %</IonCol>

                    </IonRow>
                    ))}
                </IonGrid>
            </IonCol>
        </IonContent>
    </IonPage>
    );
};

export default Asistencia;