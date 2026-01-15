//MODIFICAR  PARA PERMITIR MODIFICAR EL CODIGO DESDE AFUERA Y QUE PUEDA SER USADO TANTO PARA ASISTENCIA COMO PARA EXAMEN

import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonModal, IonTextarea, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createNewList } from '../../api/list';
import { useParams } from 'react-router';

import QRCode from "react-qr-code";

const QRClass: React.FC<{
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    value?: string;
    code?: string;
}> = ({
    isVisible, setIsVisible, value, code
}) => {

    const [present] = useIonToast();
    const {t} = useTranslation();
    
    
    const [codeQR, setCodeQR] = useState<string | null>(null);
    
    const crearListado = async () => {
        const res = await createNewList();
        if (res.data.existingOpenList){
            setIsVisible(false);
            present({message: t('CONTINUA.ALERTAS.LISTA_EXISTE'), duration: 4000, cssClass: "error-toast"});
        }
        else {
            setCodeQR(res.data.codigo);
            console.log(res.data.codigo);
        }
    }

    useEffect(() => {
        if (!isVisible) return;
        if(value=='lista') {
            crearListado();
        }
    }, [isVisible, value])



    useEffect(() => {
        const handleBack = () => {
            if (isVisible) {
                setIsVisible(false);
            }
        };
        window.addEventListener("popstate", handleBack);
        return () => {
            window.removeEventListener("popstate", handleBack);
        };
    }, [isVisible, setIsVisible]);

    //if(!sessionId) return null;

    return (
    <IonModal
        isOpen={isVisible}
        onIonModalDidDismiss={() => {setIsVisible(false)}}
    >
        {value == 'lista' ? (
            <IonContent className="ion-padding ion-text-center">
            <h2 className='ion-padding-bottom'>{t("CONTINUA.REGISTRO")}</h2>
            <QRCode value={`http://192.168.0.15:5173/app/alumnoRegistro/${codeQR}`} style={{ maxHeight: "80%", width: "auto" }}/>
        </IonContent>
        ) : null}

        
    </IonModal>
    );
};

export default QRClass;