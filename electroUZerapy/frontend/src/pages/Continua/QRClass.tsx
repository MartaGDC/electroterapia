import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonModal, IonTextarea, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createNewList } from '../../api/list';
import QRCode from "react-qr-code";

const QRClass: React.FC<{
    isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    isOpen, setIsOpen
}) => {

    const {t} = useTranslation();
    const [sessionId, setSessionId] = useState<string | null>(null);
    
    const cerrarQR = () => setIsOpen(false);
    
    useEffect(() => {
        if (!isOpen) return;
        
        const crearListado = async () => {
            const res = await createNewList();
            setSessionId(res.data.sessionId)
        }
    }, [isOpen])

    if(!sessionId) return null;

    return (
    <IonModal
        isOpen={isOpen}
        onIonModalDidDismiss={cerrarQR}
    >
        <IonContent className="ion-padding ion-text-center">
            <h2 className='ion-padding-bottom'>{t("CONTINUA.REGISTRO")}</h2>
            <QRCode value={sessionId} style={{ maxHeight: "80%", width: "auto" }}/>
            <IonButton
            className="ion-margin-top"
            onClick={cerrarQR}
            >
                {t("ACTIVIDAD.CONFIRMAR")}
        </IonButton>
        </IonContent>
    </IonModal>
    );
};

export default QRClass;