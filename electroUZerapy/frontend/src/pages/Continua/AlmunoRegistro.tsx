import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import constants from '../../constants/constants';
import { registrarById } from '../../api/list';
import { useParams } from 'react-router';
import { copyOutline } from 'ionicons/icons';
import { Roles } from '../../constants/interfaces';
import QrScanner from "qr-scanner";
import { useUser } from '../../context/userContext';


const AlumnoRegistro: React.FC = () => {
    const [present] = useIonToast();
    const {t} = useTranslation();
    const { id } = useParams<{ id: string }>(); //Si se accede desde alumno para registro asistencia
    const { user } = useUser();
    const router = useIonRouter();

    useEffect(() => {
        if (!id) {
            present({message: t('CONTINUA.ALERTAS.MAL_QR'), duration: 4000, cssClass: "error-toast"});
            return;
        }
        const registrarAsistencia = async () => {
            if (!user.token) {
                router.push(`/?redirect=/alumnoRegistro?listId=${id}`, 'forward', 'replace');
                return;
            }

            if (user.token && user.role == Roles.ALUMNO) {
                const registrar = async () => {
                    const res = await registrarById(id);
                    if (res.status === 200) {
                        present({ message: t('CONTINUA.REGISTRADO'), duration: 4000, cssClass: "success-toast" });
                    } else {
                        present({ message: t('CONTINUA.ALERTAS.ERROR_REGISTRO'), duration: 4000, cssClass: "error-toast" });
                    }
                }
                registrar();
            }
        };
        registrarAsistencia();
    }, [id, user.token]);
    return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Asistencia</h2>
        </div>
    );
};

export default AlumnoRegistro;