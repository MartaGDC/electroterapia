import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonModal, IonTextarea, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createNewList } from '../../api/list';
import QRCode from "react-qr-code";

const QRClass: React.FC<{
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    isVisible, setIsVisible
}) => {

    const [present] = useIonToast();
    const {t} = useTranslation();
    const [sessionId, setSessionId] = useState<string | null>(null);
    
    const cerrarQR = () => {
        setIsVisible(false);
        location.reload();
    }
    
    const crearListado = async () => {
        const res = await createNewList();
        if (res.data.existingOpenList){
            setIsVisible(false);
            present({message: t('CONTINUA.ALERTAS.LISTA_EXISTE'), duration: 4000, cssClass: "error-toast"});
        }
        else {
            setSessionId(res.data._id);
        }
    }

    useEffect(() => {
        if (!isVisible) return;
        crearListado();
    }, [isVisible])

    if(!sessionId) return null;

    return (
    <IonModal
        isOpen={isVisible}
        onIonModalDidDismiss={cerrarQR}
    >
        <IonContent className="ion-padding ion-text-center">
            <h2 className='ion-padding-bottom'>{t("CONTINUA.REGISTRO")}</h2>
            <QRCode value={sessionId} style={{ maxHeight: "80%", width: "auto" }}/>
        </IonContent>
    </IonModal>
    );
};

export default QRClass;