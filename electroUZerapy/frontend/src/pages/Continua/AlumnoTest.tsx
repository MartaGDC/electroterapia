import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonMenuButton, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import Logo from '../../components/Logo';
import { getTestAleatorio, submit } from '../../api/test';


const AlumnoTest: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const [preguntas, setPreguntas] = useState<any[]>([]);
    const [respuestas, setRespuestas] = useState<any>({});
    const [indice, setIndice] = useState(0);
    const router = useIonRouter();
    const {t} = useTranslation();
    
    useEffect(() => {
        const cargarPreguntas = async () => {
            const res = await getTestAleatorio(quizId);
            console.log(res);
            setPreguntas(res.data.preguntas);
        };
        cargarPreguntas();
    }, [quizId]);
    const responder = (respuestaId: string) => {
        const preguntaActual = preguntas[indice];
        
        setRespuestas({
            ...respuestas,
            [preguntaActual._id]: respuestaId
        });
        setIndice(prev => prev + 1);
    };
    
    const enviarTest = async () => {
        const payload = Object.entries(respuestas).map(([pregunta, respuestaId]) => ({
            pregunta,
            respuestaId
        }));
        await submit(quizId, payload);
    };
    
    useEffect(() => {
        if (indice === preguntas.length && preguntas.length > 0) {
            enviarTest();
        }
    }, [indice, preguntas, respuestas, quizId]);

    const pregunta = preguntas[indice];

    return (
        <IonPage>
            <IonContent className='ion-no-padding ion-no-margin' fullscreen>
                <div className="lista-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    {indice < preguntas.length && (
                        <>
                            <h1 className='ion-padding ion-margin'>{t('CONTINUA.HACER_TEST')}</h1>
                            <IonCard className='ion-no-padding ion-no-margin' style={{ width: '80%', maxWidth: '400px'}}>
                                <IonCardHeader className= 'ion-no-padding ion-margin'>
                                    <IonCardTitle className='ion-no-margin ion-text-center'>Pregunta {indice + 1} / {preguntas.length}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent className='ion-margin ion-padding'>
                                    <h2>{pregunta.pregunta}</h2>
                                </IonCardContent>
                            </IonCard>
                            <IonButtons className='ion-margin' style={{ flexDirection: 'column', width: '80%', maxWidth: '400px' }}>
                                {pregunta.respuestas.map((r: any) => (
                                <IonButton strong={true} className='ion-margin ion-padding-top' color={'background'} key={r.id} style={{ width: "100%" }}onClick={() => responder(r.id)}>
                                    {r.enunciado}
                                </IonButton>
                                ))}
                            </IonButtons>
                        </>
                    )}
                    {indice >= preguntas.length && preguntas.length > 0 && (
                        <h1 className='ion-padding ion-margin'>{t('CONTINUA.TEST_FINALIZADO')}</h1>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};
export default AlumnoTest;