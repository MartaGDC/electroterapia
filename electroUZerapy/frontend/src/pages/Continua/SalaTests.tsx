//Donde se mostrarán el resgistro de notas de los alumnos según el test seleccionado

import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SalaTests.css'
import constants from '../../constants/constants';
import { getTestById, getTestCorregidoById, cambiarEstado, getAllTestsCorregidos} from '../../api/test';
import { useParams } from 'react-router';
import { Test } from '../../constants/interfaces';
import TogglePicker from '../../components/Pickers/TogglePicker';
import QRClass from './QRClass';

const SalaTests: React.FC = () => {
    const [present] = useIonToast();
    const { testId } = useParams<{ testId: string }>();

    const {t} = useTranslation();
    
    const [test, setTest] = useState<Test>();
    const [testCorregidos, setTestCorregidos] = useState<Test[]>([]);
    const firstOpen = useRef(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    const cambioDeEstado = async () => {
        const res = await cambiarEstado({testId:testId, isOpen});
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
        const getTest = async () => {
            const res = await getTestById(testId);
            console.log(res);
            if (res.status === 200){
                setTest(res.data.test);
                setIsOpen(res.data.test.isOpen);
            }
        }
        getTest();
    }, [testId]);
    
    useEffect(() => {
        const getTestCorregidos = async () => {
            const res = await getTestCorregidoById(testId);
            console.log(res);
            if (res.status === 200){
                setTest(res.data.test);
                setIsOpen(res.data.test.isOpen);
            }
        }
        getTestCorregidos();
    }, [testId]);

    useEffect(() => {
        if (test) {
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
                            {t("MENU.CONTINUA")}: {test && new Date(test.start).toLocaleDateString('es-ES', {
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
                    name={t('CONTINUA.EXAMEN.LABEL')}
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
            <IonCol className='ion-padding-start' size='8'>
                <h3 className='ion-padding-start ion-margin-start' style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                    {t("CONTINUA.LISTA")} de {test && new Date(test.start).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric'
                    })}:
                </h3>
                {test?.alumnos?.map((user, idx) => (
                    <IonRow className="ion-padding ion-margin" key={user._id ?? idx}>
                        <strong className='ion-padding-start ion-margin-start'>{idx + 1}.</strong>
                        <span className="ion-padding-start ion-margin-start">{user.name}</span>
                    </IonRow>
                ))}
            </IonCol>
        </IonContent>
        <QRClass
            value="test"
            isVisible={isVisible}
            setIsVisible={setIsVisible}
        />
    </IonPage>
    );
};

export default SalaTests;