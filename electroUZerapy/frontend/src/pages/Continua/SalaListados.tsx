//Donde se mostrarán el resgistro de asistencia seleccionado y quizá debajo todos los alumnos con sus asistencias totales

import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SalaListados.css'
import constants from '../../constants/constants';
import { getListById} from '../../api/list';
import { useParams } from 'react-router';
import { List } from '../../constants/interfaces';

const SalaListados: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const {t} = useTranslation();
    
    const [list, setList] = useState<List>();
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    
    useEffect(() => {
        const getList = async () => {
            const res = await getListById(id);
            console.log(res);

            if (res.status == 200){
                setList(res.data.list);
                setDate(res.data.list.date);
                setDescription(res.data.list.description);
            }
        }
        getList();
    }, []);
    
    return (
    <IonPage>
        <IonHeader className='page-header'>
            <IonToolbar className=''>
                <IonButtons className='ion-margin' slot='start'>
                    <IonMenuButton color={'background'} className='ion-margin-end'/></IonButtons>
                    <div className='titulo-page'>
                        <IonIcon icon={constants.continuaIcon}/>
                        <IonTitle> {t("MENU.CONTINUA")} </IonTitle>
                    </div>
            </IonToolbar>
        </IonHeader>
        <IonContent className='content-aprendizaje' fullscreen>
            <IonRow>
                <IonCol className='ion-padding-start' size='8'>
                    <ul className='ion-no-padding ion-no-margin'>
                    {list && list.users.map((user, idx) => (
                        <li className='ion-no-margin' key={idx}>
                            {user.userName}
                        </li>
                    ))}
                    </ul>
                </IonCol>
            </IonRow>
        </IonContent>
    </IonPage>
    );
};

export default SalaListados;