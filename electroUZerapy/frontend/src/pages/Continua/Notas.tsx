//Donde se mostrarán el resgistro de todas las asistencias

import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import constants from '../../constants/constants';
import { getAllTests, getTestCorregidoById } from '../../api/test';
import './SalaListados.css';

const Notas: React.FC = () => {
    const {t} = useTranslation();
    const [resultado, setResultado] = useState<any[]>([]);

    type scoreAlumno = {
        name: string;
        score: number;
        examenes: number;
        media: number;
    };

    useEffect(() => {
        const getTests = async () => {
            const resTests = await getAllTests();
            if (resTests.status !== 200) return;
            const mapAlumnos: Record<string, scoreAlumno>={};

            for (const test of resTests.data.tests) {
                const resNotas = await getTestCorregidoById(test._id);
                if (resNotas.status !== 200) continue;

                const testCorregidos = Array.isArray(resNotas.data.testCorregido) ? resNotas.data.testCorregido : [resNotas.data.testCorregido];

                for (const examen of testCorregidos) {
                    const name = examen.alumno.name;
                    if (!mapAlumnos[name]) {
                        mapAlumnos[name] = { name, score: 0, examenes: 0, media: 0 };
                    }
                    mapAlumnos[name].score += examen.score/4*10;
                    mapAlumnos[name].examenes += 1;
                }
            }
            const resultado = Object.values(mapAlumnos).map(alumno => ({
                ...alumno,
                media: alumno.score / alumno.examenes
            }));
            setResultado(resultado);
        };
        getTests();
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
        <IonContent className='content-listados' fullscreen>
            <IonCol>
                <h2 className='ion-padding ion-margin' style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                    {t("CONTINUA.LISTA")}:
                </h2>
                <IonGrid className="ion-padding ion-margin">
                    <IonRow className="ion-margin-start ion-padding-start ion-margin-end ion-padding-end" style={{background: 'var(--ion-color-primary)', color: 'white', borderRadius: '10px'}}>
                        <IonCol className="ion-text-center table-header"><h3>{t("LOGIN.USUARIO")}</h3></IonCol>
                        <IonCol className="ion-text-center table-header"><h3>{t("CONTINUA.SCORE_MEDIO")}</h3></IonCol>
                    </IonRow>
                    {resultado.map((user, idx) => (
                        <IonRow className="ion-margin-start ion-margin-top ion-padding-start ion-margin-end ion-padding-end" key={idx}>
                            <IonCol className="ion-text-center">{user.name}</IonCol>
                            <IonCol className="ion-text-center">{user.media}</IonCol>
                        </IonRow>
                    ))}
                    
                </IonGrid>
            </IonCol>
        </IonContent>
    </IonPage>
    );
};

export default Notas;