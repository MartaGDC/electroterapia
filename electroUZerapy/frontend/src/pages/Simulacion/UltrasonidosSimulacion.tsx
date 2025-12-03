import './UltrasonidosSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tramosOptions, valueOptions } from '../../components/Logica/General';
import { ultrasonidos } from '../../classes/Ultrasonidos';
import TimePicker from '../../components/Pickers/TimePicker';
import ListPicker from '../../components/Pickers/ListPicker';
import RangePicker from '../../components/Pickers/RangePicker';
import constants from '../../constants/constants';
import { Simuladores, Time } from '../../constants/interfaces';
import { useLog } from '../../context/logContext';
import LogButton from '../../components/Logs/LogButton';
import ImageMapper from '../../components/ImageMapper/ImageMapper';
import { AplicadorUltrasonidos } from '../../classes/TiposAplicadores';

const UltrasonidosSimulacion: React.FC<{
  type: "simulacion" | "evaluacion"
}> = ({
  type
}) => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar,
    agregarParams, reset,
    aplicador1, setAplicador1,
    aplicador2, setAplicador2
  } = useLog();
  
  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const [frecuencia, setFrecuencia] = useState(null);
  const [intensidad, setIntensidad] = useState(ultrasonidos.INTENSIDAD.min);
  const [emision, setEmision] = useState(null);
  const [relacion, setRelacion] = useState<any>(null);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  const [dosisTotal, setDosisTotal] = useState(0);
  const [superficie, setSuperficie] = useState(ultrasonidos.SUPERFICIE.min);
  const [dosisPorCm, setDosisPorCm] = useState(0);

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {    
    setFrecuencia(null);
    setIntensidad(ultrasonidos.INTENSIDAD.min);
    setEmision(null);
    setRelacion(null);
    setTratamiento(new Time(0, 0));
    setDosisTotal(0);
    setSuperficie(ultrasonidos.SUPERFICIE.min);
    setDosisPorCm(0);

    reset();
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones de ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const frecOptions = valueOptions('ULTRASONIDOS.FRECUENCIA.OPCIONES', t, ultrasonidos.CONDUCCION, () => false);
  const emiOptions = valueOptions('ULTRASONIDOS.EMISION.OPCIONES', t, ultrasonidos.MODO_EMISION.values, () => false);
  const relOptions = valueOptions('ULTRASONIDOS.RELACION.OPCIONES', t, ultrasonidos.RELACION_PULSO, (idx: any) => idx == 0 && emision == ultrasonidos.MODO_EMISION.PULSADO);

  //////////////////////////////////////////////////////////////////////////////
  // Controla parámetros calculados automáticamente
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (aplicador1?.modo instanceof AplicadorUltrasonidos && aplicador1.modo.size !== null && relacion !== null) {
      console.log("aplicador1.modo.size", aplicador1.modo.size);
      setDosisTotal(intensidad * aplicador1.modo.size * tratamiento.toSeconds() * relacion);
    } else {
      setDosisTotal(0);
    }
  }, [dosisTotal, intensidad, aplicador1, tratamiento, relacion])

  useEffect(() => {
    if (superficie == 0) setDosisPorCm(0);
    else setDosisPorCm(dosisTotal / superficie)
  }, [dosisPorCm, dosisTotal, superficie])

  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return {
      intensidad,
      emision,
      relacion
    }
  }

  const iniciarTratamiento = () => {
    if (frecuencia == null) {
      present({ message: t('ULTRASONIDOS.ALERTAS.FRECUENCIA'), duration: 4000, cssClass: "error-toast" });
    } else if (emision == null) {
      present({ message: t('ULTRASONIDOS.ALERTAS.EMISION'), duration: 4000, cssClass: "error-toast" });
    } else if (relacion == null) {
      present({ message: t('ULTRASONIDOS.ALERTAS.RELACION'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('ULTRASONIDOS.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento, frecuencia, dosisPorCm, dosisTotal, superficie },
        { time: Date.now(), params: params() },
        Simuladores.ULTRASONIDOS
      )
    }
  }

  useEffect(() => {
    agregarParams({ time: Date.now(), params: params() })
  }, [intensidad, emision, relacion])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t('ULTRASONIDOS.ULTRASONIDOS')} </IonTitle>
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
              <h2 className='negro'> {t('ULTRASONIDOS.PARAMETROS')} </h2>
              
              {/* Frecuencia de emisión */}
              <ListPicker
                variable={frecuencia}
                onChange={setFrecuencia}
                label={t('ULTRASONIDOS.FRECUENCIA.FRECUENCIA')}
                placeholder={t('ULTRASONIDOS.FRECUENCIA.PH')}
                valueOptions={frecOptions}
                disabled={simulating}
              />

              {/* Intensidad / Potencia */}
              <RangePicker
                name={t('ULTRASONIDOS.INTENSIDAD')}
                variable={intensidad}
                setVariable={setIntensidad}
                min={ultrasonidos.INTENSIDAD.min}
                max={ultrasonidos.INTENSIDAD.max}
                step={ultrasonidos.INTENSIDAD.step}
                unit='W/cm²'
              />

              {/* Modo de emisión */}
              <ListPicker
                variable={emision}
                onChange={(e: any) => {
                  e == ultrasonidos.MODO_EMISION.CONTINUO ? 
                  setRelacion(ultrasonidos.RELACION_PULSO[0]) : setRelacion(null)
                  setEmision(e);
                }}
                label={t('ULTRASONIDOS.EMISION.LABEL')}
                placeholder={t('ULTRASONIDOS.EMISION.PH')}
                valueOptions={emiOptions}
                disabled={simulating && !paused}
              />

              {/* Duty Cycle */}
              <ListPicker
                variable={relacion}
                onChange={setRelacion}
                label={t('ULTRASONIDOS.RELACION.LABEL')}
                placeholder={t('ULTRASONIDOS.RELACION.PH')}
                valueOptions={relOptions}
                disabled={emision == ultrasonidos.MODO_EMISION.CONTINUO || (simulating && !paused)}
              />

              {/* Tiempo de tratamiento */}
              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
              />

              {/* Dosis total */}
              <RangePicker
                name={t('ULTRASONIDOS.DOSIS_TOTAL')}
                variable={dosisTotal}
                setVariable={setDosisTotal}
                min={ultrasonidos.DOSIS_TOTAL.min}
                max={ultrasonidos.DOSIS_TOTAL.max}
                step={ultrasonidos.DOSIS_TOTAL.step}
                unit='J'
                disabled={true}
              />

              {/* Superficie tratada */}
              <RangePicker
                name={t('ULTRASONIDOS.SUPERFICIE_TRATADA')}
                variable={superficie}
                setVariable={setSuperficie}
                min={aplicador1?.modo instanceof AplicadorUltrasonidos && aplicador1.modo.size !== null 
                  ? aplicador1.modo.size : ultrasonidos.SUPERFICIE.min}
                max={ultrasonidos.SUPERFICIE.max}
                step={ultrasonidos.SUPERFICIE.step}
                unit='cm²'
                disabled={simulating}
              />

              {/* Dosis / cm² */}
              <RangePicker
                name={t('ULTRASONIDOS.DOSIS.LABEL')}
                variable={dosisPorCm}
                setVariable={setDosisPorCm}
                min={ultrasonidos.SUPERFICIE_CM.min}
                max={ultrasonidos.SUPERFICIE_CM.max}
                step={ultrasonidos.SUPERFICIE_CM.step}
                unit='cm²'
                disabled={true}
              />

              {/* Botón de iniciar tratamiento */}
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

export default UltrasonidosSimulacion;