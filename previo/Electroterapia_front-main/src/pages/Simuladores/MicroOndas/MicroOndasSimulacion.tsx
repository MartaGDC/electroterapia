import './MicroOndasSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { valueOptions } from '../../../components/Logica/General';
import { dutyCycles, maxDistancia, maxPotencia, minDistancia, minPotencia, modo_emision, stepDistancia, stepPotencia } from './MicroOndas';
import ListPicker from '../../../components/Pickers/ListPicker';
import TimePicker from '../../../components/Pickers/TimePicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';
import ImageMapper from '../../../components/ImageMapper/ImageMapper';

const MicroOndasSimulacion: React.FC<{
  type: "simulacion" | "evaluacion"
}> = ({
  type
}) => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar,
    agregarParams, reset
  } = useLog();
  
  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const frecuencia = 2.45;
  const [potencia, setPotencia] = useState(minPotencia);
  const [emision, setEmision] = useState(null);
  const [dutyCycle, setDutyCycle] = useState<any>();
  const [distancia, setDistancia] = useState(maxDistancia);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  
  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const emiOptions = valueOptions('MICROONDAS.EMISION.OPCIONES', t, modo_emision.values, () => false);
  const dutyOptions = valueOptions('MICROONDAS.DUTY_CYCLE.OPCIONES', t, dutyCycles, (idx: any) => dutyCycles[idx] == 0);
  
  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {
    setPotencia(minPotencia);
    setEmision(null);
    setDutyCycle(null);
    setDistancia(maxDistancia);
    setTratamiento(new Time(0, 0));

    reset();
  });

  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return {
      potencia,
      emision,
      dutyCycle,
    };
  };

  const iniciarTratamiento = () => {
    if (emision == null) {
      present({ message: t('MICROONDAS.ALERTAS.EMISION'), duration: 4000, cssClass: "error-toast" });
    } else if (dutyCycle == null) {
      present({ message: t('MICROONDAS.ALERTAS.RELACION'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('MICROONDAS.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento, frecuencia, distancia },
        { time: Date.now(), params: params() },
        Simuladores.MICROONDAS
      )
    }
  }

  useEffect(() => {
    agregarParams({
      time: Date.now(),
      params: params()
    })
  }, [potencia, emision, dutyCycle, distancia])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t('MICROONDAS.MICROONDAS')} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColSimulacion} className='ion-padding ion-no-margin'>
            <IonContent>
              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('MICROONDAS.PARAMETROS')} </h2>

              {/* Frecuencia */}
              <RangePicker
                name={t('MICROONDAS.FRECUENCIA')}
                variable={frecuencia}
                setVariable={() => {}} // Nunca se usa
                min={0}
                max={100}
                step={1}
                disabled={true}
                unit='GHz'
              />
              
              {/* Potencia */}
              <RangePicker
                name={t('MICROONDAS.POTENCIA')}
                variable={potencia}
                setVariable={setPotencia}
                min={minPotencia}
                max={maxPotencia}
                step={stepPotencia}
                unit='W'
              />
          
              {/* Modo de emisión */}
              <ListPicker
                variable={emision}
                onChange={(e: any) => {
                  setEmision(e);
                  setDutyCycle(e == modo_emision.CONTINUO ? dutyCycles[0] : null);
                }}
                label={t('MICROONDAS.EMISION.LABEL')}
                placeholder={t('MICROONDAS.EMISION.PH')}
                valueOptions={emiOptions}
                disabled={simulating && !paused}
              />

              {/* Relación de pulso / Duty Cycle */}
              <ListPicker
                variable={dutyCycle}
                onChange={setDutyCycle}
                label={t('MICROONDAS.DUTY_CYCLE.LABEL')}
                placeholder={t('MICROONDAS.DUTY_CYCLE.PH')}
                valueOptions={dutyOptions}
                disabled={emision == modo_emision.CONTINUO || (simulating && !paused)}
              />
              
              {/* Distancia */}
              <RangePicker
                name={t('MICROONDAS.DISTANCIA')}
                variable={distancia}
                setVariable={setDistancia}
                min={minDistancia}
                max={maxDistancia}
                step={stepDistancia}
                unit='cm'
                disabled={simulating}
              />

              {/* Tiempo de tratamiento */}
              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
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

export default MicroOndasSimulacion;