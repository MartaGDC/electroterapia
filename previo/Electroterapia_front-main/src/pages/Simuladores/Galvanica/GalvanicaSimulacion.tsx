import './GalvanicaSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { maxIntensidad, minIntensidad, tecnicas } from './Galvanica';
import TimePicker from '../../../components/Pickers/TimePicker';
import ImageMapper from '../../../components/ImageMapper/ImageMapper';
import {Simuladores, Time } from '../../../constants/interfaces';
import constants from '../../../constants/constants';
import { useLog } from '../../../context/logContext';
import RangePicker from '../../../components/Pickers/RangePicker';
import LogButton from '../../../components/Logs/LogButton';

const GalvanicaSimulacion: React.FC<{
  type: "simulacion" | "evaluacion"
}> = ({
  type
}) => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, tiempoRestante, 
    iniciar, agregarParams, reset
  } = useLog();

  //////////////////////////////////////////////////////////////////////////////
  // Parámetros fijos
  //////////////////////////////////////////////////////////////////////////////
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  const [rampa, setRampa] = useState<Time>(new Time(0, 0));

  //////////////////////////////////////////////////////////////////////////////
  // Parámetros variables
  //////////////////////////////////////////////////////////////////////////////
  const [intensidad, setIntensidad] = useState(0);
  
  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {
    setTratamiento(new Time(0, 0));
    setRampa(new Time(0, 0));
    setIntensidad(0);
    
    reset();
  })

  //////////////////////////////////////////////////////////////////////////////
  // Funciones: Generación de logs
  //////////////////////////////////////////////////////////////////////////////
  const iniciarTratamiento = async () => {
    if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('GALVANICA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });
    } else {
      iniciar(
        type,
        tratamiento,
        { tratamiento, rampa },
        { time: Date.now(), params: { intensidad } },
        Simuladores.GALVANICA
      );
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  // Registro de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (simulating) {
      agregarParams({ time: Date.now(), params: { intensidad }})
    }
  }, [intensidad]);

  return (
    <IonPage>
      <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end' />
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t("GALVANICA.GALVANICA.0")} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='content-sim'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColSimulacion} className='izq-sim ion-padding ion-no-margin'>
            <IonContent>

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2> {t('GALVANICA.PARAMETROS')} </h2>

              {/* Intensidad */}
              <RangePicker
                name={t('GALVANICA.INTENSIDAD')}
                variable={intensidad}
                setVariable={setIntensidad}
                min={minIntensidad}
                max={maxIntensidad}
                step={0.1}
                unit='mA'
              />

              {/* Tiempo de tratamiento */}
              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
              />

              {/* Tiempo de Rampa */}
              <TimePicker
                variable={rampa} 
                setVariable={setRampa}
                doAnimation={simulating}
                tiempoRestante={
                  rampa.toSeconds() * 1000 - (tratamiento.toSeconds() * 1000 - tiempoRestante) >= 0 
                  ? new Time(0, 0, rampa.toSeconds() * 1000 - (tratamiento.toSeconds() * 1000 - tiempoRestante))
                  : new Time(0, 0)
                }
                labelText='Tiempo de rampa'
              />

              {/* Botón iniciar tratamiento */}
              <LogButton iniciar={iniciarTratamiento} />

            </IonContent>
          </IonCol>
          {/* Parte derecha */}
          <IonCol size={constants.dchColSimulacion} className='cuerpo ion-no-padding ion-no-margin'>
            <IonContent>
              <ImageMapper />
            </IonContent>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default GalvanicaSimulacion;