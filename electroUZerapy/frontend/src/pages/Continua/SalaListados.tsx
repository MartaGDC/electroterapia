//Donde se mostrarán el resgistro de asistencia seleccionado y quizá debajo todos los alumnos con sus asistencias totales

import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SalaListados.css'
import constants from '../../constants/constants';
import { getListById, cambiarEstado} from '../../api/list';
import { useParams } from 'react-router';
import { List } from '../../constants/interfaces';
import TogglePicker from '../../components/Pickers/TogglePicker';
import QRClass from './QRClass';

const SalaListados: React.FC = () => {
    const [present] = useIonToast();
    const router = useIonRouter(); 
    const { id } = useParams<{ id: string }>();

    const {t} = useTranslation();
    
    const [list, setList] = useState<List>();
    const firstOpen = useRef(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    const cambioDeEstado = async () => {
        const res = await cambiarEstado({idList:id, isOpen});
        console.log(res);
        if (res.status === 200) {
            if (firstOpen.current) {
                firstOpen.current = false;
            }
            else {
                present({ message: t('CONTINUA.CAMBIADA'), duration: 4000, cssClass: "success-toast" });
            }
        } else {
            present({ message: t('CONTINUA.ERROR_CAMBIO'), duration: 4000, cssClass: "error-toast" });
        }
    }
    
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    useEffect(() => {
        const getList = async () => {
            const res = await getListById(id);
            if (res.status === 200){
                setList(res.data.list);
                setIsOpen(res.data.list.isOpen);
            }
        }
        getList();
    }, [id]);

    useEffect(() => {
        if (list) {
            cambioDeEstado();
        }
    }, [isOpen]);
    
    return (
    <IonPage>
        <IonHeader className='page-header'>
            <IonToolbar className=''>
                <IonButtons className='ion-margin' slot='start'>
                    <IonMenuButton color={'background'} className='ion-margin-end'/></IonButtons>
                    <div className='titulo-page'>
                        <IonIcon icon={constants.continuaIcon}/>
                        <IonTitle>
                            {t("MENU.CONTINUA")}: {list && new Date(list.start).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            })}
                        </IonTitle>
                    </div>
            </IonToolbar>
        </IonHeader>
        <IonContent className='content-listados' fullscreen>
            <div className='ion-padding-end'>
                <TogglePicker
                    variable={isOpen}
                    onChange={() => setIsOpen(!isOpen)}
                    name={t('CONTINUA.ESTADO.LABEL')}
                    msgTrue={t('CONTINUA.ESTADO.ABIERTO')}
                    msgFalse={t('CONTINUA.ESTADO.CERRADO')}
                />
            </div>
            {isOpen && (
                <IonToolbar>
                    <IonButtons slot="end">
                        <IonButton 
                            fill="solid" 
                            color="primary" 
                            strong={true} 
                            onClick={() => setIsVisible(true)}
                        >
                            {t('CONTINUA.MOSTRAR_QR')}
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            )}
            <IonRow>
                <IonCol className='ion-padding-start' size='8'>
                    <ul className='ion-no-padding ion-no-margin'>
                    {list && list.asistentes.map((user, idx) => (
                        <li className='ion-no-margin' key={idx}>
                            {user.userName}
                        </li>
                    ))}
                    </ul>
                </IonCol>
            </IonRow>
        </IonContent>
        <QRClass
            value={id}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
        />
    </IonPage>
    );
};

export default SalaListados;