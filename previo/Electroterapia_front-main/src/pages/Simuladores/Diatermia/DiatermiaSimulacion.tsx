import './DiatermiaSimulacion.css'

import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonMenuButton, IonPage, IonPickerLegacy, IonRange, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToast, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Grafica from '../../../components/Grafica/Grafica';
import { pulseOutline, time } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { conductores, dutyCycles, electrodo_activo_bi, electrodo_activo_mo, electrodo_pasivo_bi, maxFrecBi, maxPotencia, minFrecBi, minPotencia, minTratamiento, modo_emision, stepFrecBi, stepPotencia, tipos } from './Diatermia';
import ListPicker from '../../../components/Pickers/ListPicker';
import TimePicker from '../../../components/Pickers/TimePicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { valueOptions } from '../../../components/Logica/General';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';
import ImageMapper from '../../../components/ImageMapper/ImageMapper';
import { Electrodo, TipoElectrodo } from '../../../classes/Electrodos';

const DiatermiaSimulacion: React.FC<{
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
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
    
  const [frecuencia, setFrecuencia] = useState(0); // MHz
  const [potencia, setPotencia] = useState(0); // W
  const [emision, setEmision] = useState(null);
  const [dutyCycle, setDutyCycle] = useState<any>(null);

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const emiOptions = valueOptions('DIATERMIA.EMISION.OPCIONES', t, modo_emision.values, () => false);
  const dutyOptions = valueOptions('DIATERMIA.DUTY_CYCLE.OPCIONES', t, dutyCycles, (idx: any) => dutyCycles[idx] == 0);    
    
  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {

    setTratamiento(new Time(0, 0));
    
    setFrecuencia(0); // MHz
    setPotencia(0); // W
    setEmision(null);
    setDutyCycle(null);
    
    reset();
  });

  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = (
  ) => {
    return {
      potencia,
      emision,
      dutyCycle,
    };
  };

  const iniciarTratamiento = () => {
    if (modo_emision == null) {
      present({ message: t('DIATERMIA.ALERTAS.MODO'), duration: 4000, cssClass: "error-toast" });
    } else if (dutyCycle == null) {
      present({ message: t('DIATERMIA.ALERTAS.RELACION'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('DIATERMIA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento, frecuencia },
        { 
          time: Date.now(), 
          params: params()
        },
        Simuladores.DIATERMIA
      )
    }
  }

  useEffect(() => {
    agregarParams({ time: Date.now(), params: params() })
  }, [potencia, emision, dutyCycle])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t("DIATERMIA.DIATERMIA")} </IonTitle>
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
              <h2 className='negro'> {t('DIATERMIA.PARAMETROS')} </h2>
              {/* Frecuencia */}
              <RangePicker
                name={t('DIATERMIA.FRECUENCIA')}
                variable={frecuencia}
                setVariable={setFrecuencia}
                min={minFrecBi}
                max={maxFrecBi}
                step={stepFrecBi}
                unit='MHz'
                disabled={simulating}
              />

              {/* Potencia */}
              <RangePicker
                name={t('DIATERMIA.POTENCIA')}
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
                label={t('DIATERMIA.EMISION.LABEL')}
                placeholder={t('DIATERMIA.EMISION.PH')}
                valueOptions={emiOptions}
                disabled={simulating && !paused}
              />

              {/* Relación de pulso */}
              <ListPicker
                variable={dutyCycle}
                onChange={setDutyCycle}
                label={t('DIATERMIA.DUTY_CYCLE.LABEL')}
                placeholder={t('DIATERMIA.DUTY_CYCLE.PH')}
                valueOptions={dutyOptions}
                disabled={emision == modo_emision.CONTINUO || (simulating && !paused)}
              />          

              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
              />

              <LogButton iniciar={iniciarTratamiento} />
            </IonContent>
          </IonCol>
          {/* Parte derecha */}
          <IonCol size={constants.dchColSimulacion} className='cuerpo ion-no-padding ion-no-margin'>
            <IonContent>
              <ImageMapper/>
            </IonContent>
          </IonCol>
        </IonRow>  
      </IonContent>
    </IonPage>
  );
};

export default DiatermiaSimulacion;