import './OndaCortaAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tramosOptions, valueOptions } from '../../components/Logica/General';
import { dutyCycles, electrodos, maxDistancia, maxFrecuencia, maxPotencia, minDistancia, minFrecuencia, minPotencia, modo_emision, modos, stepDistancia, stepFrecuencia, stepPotencia } from '../../classes/OndaCorta';
import ListPicker from '../../components/Pickers/ListPicker';
import RangePicker from '../../components/Pickers/RangePicker';
import TimePicker from '../../components/Pickers/TimePicker';
import RangeColorPicker from '../../components/Pickers/RangeColorPicker';
import constants from '../../constants/constants';
import { Simuladores, Time } from '../../constants/interfaces';
import { useLog } from '../../context/logContext';
import LogButton from '../../components/Logs/LogButton';

const OndaCortaAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar
  } = useLog();
  
  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const [modo, setModo] = useState(null);

  const frecuencia = 27.12;
  const [potencia, setPotencia] = useState(minPotencia);
  const [emision, setEmision] = useState(null);
  const [dutyCycle, setDutyCycle] = useState<any>();
  const [distancia, setDistancia] = useState(maxDistancia);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {
    setModo(null);
    setPotencia(minPotencia);
    setEmision(null);
    setDutyCycle(null);
    setDistancia(maxDistancia);
    setTratamiento(new Time(0, 0));      
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones de ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const modoOptions = valueOptions('ONDA_CORTA.MODO.OPCIONES', t, modos.values, () => false);
  const elecOptions = valueOptions('ONDA_CORTA.ELECTRODOS.OPCIONES', t, electrodos.values, () => false);
  const emiOptions = valueOptions('ONDA_CORTA.EMISION.OPCIONES', t, modo_emision.values, () => false);
  const dutyOptions = valueOptions('ONDA_CORTA.DUTY_CYCLE.OPCIONES', t, dutyCycles, (idx: any) => dutyCycles[idx] == 0);
  const tramosMsg = tramosOptions('ONDA_CORTA.SECCIONES', t);
      
  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const iniciarTratamiento = () => {
    if (modo == null) {
      present({ message: t('ONDA_CORTA.ALERTAS.MODO'), duration: 4000, cssClass: "error-toast" });
    } else if (emision == null) {
      present({ message: t('ONDA_CORTA.ALERTAS.EMISION'), duration: 4000, cssClass: "error-toast" });
    } else if (dutyCycle == null) {
      present({ message: t('ONDA_CORTA.ALERTAS.RELACION'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('ONDA_CORTA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: {  } },
        Simuladores.ONDACORTA
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
            <IonTitle> Onda Corta </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
            <IonContent>
              <ListPicker
                variable={modo}
                onChange={setModo}
                label={t('ONDA_CORTA.MODO.LABEL')}
                placeholder={t('ONDA_CORTA.MODO.PH')}
                valueOptions={modoOptions}
                disabled={simulating}
              />

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('ONDA_CORTA.PARAMETROS')} </h2>

              {/* Frecuencia */}
              <RangePicker
                name={t('ONDA_CORTA.FRECUENCIA')}
                variable={frecuencia}
                setVariable={() => {}}
                min={minFrecuencia}
                max={maxFrecuencia}
                step={stepFrecuencia}
                disabled={true}
                unit='MHz'
              />

              {/* Potencia */}
              <RangePicker
                name={t('ONDA_CORTA.POTENCIA')}
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
                label={t('ONDA_CORTA.EMISION.LABEL')}
                placeholder={t('ONDA_CORTA.EMISION.PH')}
                valueOptions={emiOptions}
                disabled={simulating && !paused}
              />

              {/* Relación de pulso */}
              <ListPicker
                variable={dutyCycle}
                onChange={setDutyCycle}
                label={t('ONDA_CORTA.DUTY_CYCLE.LABEL')}
                placeholder={t('ONDA_CORTA.DUTY_CYCLE.PH')}
                valueOptions={dutyOptions}
                disabled={emision != modo_emision.PULSADO || (simulating && !paused)}
              />

              <RangeColorPicker
                name={t('ONDA_CORTA.DISTANCIA')}
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
              />

              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
                infoMsg={t('ONDA_CORTA.TIEMPO_MSG')}
              />

              <LogButton iniciar={iniciarTratamiento} />

              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('ONDA_CORTA.MATERIALES')} </h2>
              
              {modo !== null &&
                <ListPicker
                  variable={modo == modos.CAPACITIVO ? electrodos.METALICO : electrodos.BOBINA_TAMBOR}
                  onChange={() => {}}
                  label={t(`ONDA_CORTA.ELECTRODOS.1.${modo == modos.CAPACITIVO ? 'CAPACITIVO' : 'INDUCTIVO'}.LABEL`)}
                  placeholder={t(`ONDA_CORTA.ELECTRODOS.1.${modo == modos.CAPACITIVO ? 'CAPACITIVO' : 'INDUCTIVO'}.PH`)}
                  valueOptions={elecOptions}
                  disabled={true}
                />
              }

              {modo == modos.CAPACITIVO &&
                <ListPicker
                  variable={modo == modos.CAPACITIVO ? electrodos.METALICO : electrodos.BOBINA_TAMBOR}
                  onChange={() => {}}
                  label={t('ONDA_CORTA.ELECTRODOS.2.LABEL')}
                  placeholder={t('ONDA_CORTA.ELECTRODOS.2.PH')}
                  valueOptions={elecOptions}
                  disabled={true}
                />
              }

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

export default OndaCortaAprendizaje;