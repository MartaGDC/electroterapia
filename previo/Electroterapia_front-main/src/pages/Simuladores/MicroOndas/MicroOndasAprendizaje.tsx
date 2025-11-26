import './MicroOndasAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tramosOptions, valueOptions } from '../../../components/Logica/General';
import { aplicadores, dutyCycles, maxDistancia, maxPotencia, minDistancia, minPotencia, modo_emision, stepDistancia, stepPotencia } from './MicroOndas';
import ListPicker from '../../../components/Pickers/ListPicker';
import TimePicker from '../../../components/Pickers/TimePicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import RangeColorPicker from '../../../components/Pickers/RangeColorPicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';

const MicroOndasAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar
  } = useLog();
  
  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const [aplicador, setAplicador] = useState<any>(null);

  const frecuencia = 2.45;
  const [potencia, setPotencia] = useState(minPotencia);
  const [emision, setEmision] = useState(null);
  const [dutyCycle, setDutyCycle] = useState<any>();
  const [distancia, setDistancia] = useState(maxDistancia);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  
  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const aplOptions = valueOptions('MICROONDAS.APLICADOR.OPCIONES', t, aplicadores.values, () => false);
  const emiOptions = valueOptions('MICROONDAS.EMISION.OPCIONES', t, modo_emision.values, () => false);
  const dutyOptions = valueOptions('MICROONDAS.DUTY_CYCLE.OPCIONES', t, dutyCycles, (idx: any) => dutyCycles[idx] == 0);
  const tramosMsg = tramosOptions('MICROONDAS.SECCIONES', t);  

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {
    setAplicador(null);
    setPotencia(minPotencia);
    setEmision(null);
    setDutyCycle(null);
    setDistancia(maxDistancia);
    setTratamiento(new Time(0, 0));
  });

  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const iniciarTratamiento = () => {
    if (aplicador == null) {
      present({ message: t('MICROONDAS.ALERTAS.APLICADOR'), duration: 4000, cssClass: "error-toast" });
    } else if (emision == null) {
      present({ message: t('MICROONDAS.ALERTAS.EMISION'), duration: 4000, cssClass: "error-toast" });
    } else if (dutyCycle == null) {
      present({ message: t('MICROONDAS.ALERTAS.RELACION'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('MICROONDAS.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: {  } },
        Simuladores.MICROONDAS
      )
    }
  }

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={constants.aprendizajeIcon}/>
            <IonTitle> Microondas </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
            <IonContent>
              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('MICROONDAS.PARAMETROS')} </h2>

              {/* Frecuencia */}
              <RangePicker
                name={t('MICROONDAS.FRECUENCIA')}
                variable={frecuencia}
                setVariable={setAplicador} // Nunca se usa
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
              <RangeColorPicker
                name={t('MICROONDAS.DISTANCIA')}
                variable={distancia}
                setVariable={setDistancia}
                min={minDistancia}
                max={maxDistancia}
                step={stepDistancia}
                sections={[
                  {value: 2, color: constants.tramos.rojo, msg: tramosMsg[0]},
                  {value: 5, color: constants.tramos.verde, msg: tramosMsg[1]},
                  {value: 15, color: constants.tramos.verdeClaro, msg: tramosMsg[2]},
                  {value: maxDistancia, color: constants.tramos.blanco, msg: tramosMsg[3]},
                ]}
                unit='cm'
                disabled={simulating}
              />

              {/* Tiempo de tratamiento */}
              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
                infoMsg={t('MICROONDAS.TIEMPO_MSG')}
              />

              {/* Botón iniciar tratamiento */}
              <LogButton iniciar={iniciarTratamiento} />

              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('MICROONDAS.MATERIALES')} </h2>
              {/* Aplicador */}
              <ListPicker
                variable={aplicador}
                onChange={setAplicador}
                label={t('MICROONDAS.APLICADOR.LABEL')}
                placeholder={t('MICROONDAS.APLICADOR.PH')}
                valueOptions={aplOptions}
                disabled={simulating}
              />

            </IonContent>
          </IonCol>
          {/* Parte derecha */}
          <IonCol size={constants.dchColAprendizaje} className='derecha ion-no-padding ion-no-margin'>
            <IonContent>
              <IonCard className='explicacion-content ion-no-padding ion-no-margin'>
                <IonCardHeader>
                  <h1 className='ion-text-center'>
                    {t("GALVANICA.INFORMACION")} 
                  </h1>
                </IonCardHeader>
                <IonCardContent>  
                  <IonText className='ion-no-margin ion-no-padding'>
                    <h3 className='ion-margin-start'>
                      {t("GALVANICA.CONCEPTO")}
                    </h3>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonContent>
          </IonCol>
        </IonRow>  
      </IonContent>
    </IonPage>
  );
};

export default MicroOndasAprendizaje;