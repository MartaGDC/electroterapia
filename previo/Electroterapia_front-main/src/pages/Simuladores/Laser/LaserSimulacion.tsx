import './LaserSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { dosis_total, frecuenciasPulso, longitudesOnda, modos_emision, potencias, superficie_tratada, tipos } from './Laser';
import TimePicker from '../../../components/Pickers/TimePicker';
import ListPicker from '../../../components/Pickers/ListPicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { valueOptions } from '../../../components/Logica/General';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';
import ImageMapper from '../../../components/ImageMapper/ImageMapper';
import { AplicadorLaser } from '../../../classes/TiposAplicadores';

const LaserSimulacion: React.FC<{
  type: "simulacion" | "evaluacion"
}> = ({
  type
}) => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar,
    agregarParams, reset,
    aplicador1
  } = useLog();
  
  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const [longitudOnda, setLongitudOnda] = useState<any>(null);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  const [potencia, setPotencia] = useState(0);
  const [dosis, setDosis] = useState(0);
  const [frecuenciaPulso, setFrecuenciaPulso] = useState(frecuenciasPulso[0].min);
  const [emision, setEmision] = useState(null);
  const [superficie, setSuperficie] = useState(superficie_tratada.min);
  
  const [tipo, setTipo] = useState(null);

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const tiposOptions = valueOptions('LASER.TIPOS.OPCIONES', t, tipos.values, () => false);
  const longOptions = valueOptions('LASER.LONGITUD_ONDA.OPCIONES', t, longitudesOnda.values, (idx: number) => {return longitudesOnda.values[idx] == longitudesOnda.HILT.value ? true : false});
  const emiOptions = valueOptions('LASER.EMISION.OPCIONES', t, modos_emision.values, () => false);

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {    
    setLongitudOnda(null);
    setTratamiento(new Time(0, 0));
    setPotencia(0);
    setDosis(0);
    setFrecuenciaPulso(frecuenciasPulso[0].min);
    setEmision(null);
    setSuperficie(superficie_tratada.min);
    setTipo(null);

    reset();
  });

  const cambiarTipo = (tec: any) => {
    setTipo(tec);

    if (tec == tipos.L_LLLT) { // LLLT
      setLongitudOnda(null);
      setFrecuenciaPulso(frecuenciasPulso[tec].min);
    } else if (tec == tipos.L_HILT) { // HILT
      setLongitudOnda(longitudesOnda.HILT.value);
      setFrecuenciaPulso(frecuenciasPulso[tec].min);
    }
  }
  
  // Para corregir dosis si se intenta modificar con el deslizador. No se pone
  // disabled=true porque no se ven bien los colores con la opacidad baja
  useEffect(() => {
    setDosis(potencia * tratamiento.toSeconds() / superficie);
  }, [dosis, potencia, tratamiento, superficie])

  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return {
      potencia,
      emision,
      ...(emision == modos_emision.PULSADO ? { frecuenciaPulso } : { })
    }
  }

  const iniciarTratamiento = () => {
    if (tipo == null) {
      present({ message: t('LASER.ALERTAS.TIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (longitudOnda == null) {
      present({ message: t('LASER.ALERTAS.LONGITUD'), duration: 4000, cssClass: "error-toast" });
    } else if (emision == null) {
      present({ message: t('LASER.ALERTAS.EMISION'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('LASER.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento, tipo, longitudOnda, superficie, dosis },
        { time: Date.now(), params: params() },
        Simuladores.LASER
      )
    }
  }

  useEffect(() => {
    agregarParams({ time: Date.now(), params: params() });
  }, [potencia, emision, frecuenciaPulso])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t('LASER.LASER')} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.dchColSimulacion} className='ion-padding ion-no-margin'>
            <IonContent>
              {/* Tipo de laser */}
              <ListPicker
                variable={tipo}
                onChange={cambiarTipo}
                label={t('LASER.TIPOS.LABEL')}
                placeholder={t('LASER.TIPOS.PH')}
                valueOptions={tiposOptions}
                disabled={simulating}
              />

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('LASER.PARAMETROS')} </h2>

              {/* Longitud de onda */}
              <ListPicker
                variable={longitudOnda}
                onChange={setLongitudOnda}
                label={t('LASER.LONGITUD_ONDA.LABEL')}
                placeholder={t('LASER.LONGITUD_ONDA.PH')}
                valueOptions={longOptions}
                disabled={tipo == tipos.L_HILT || simulating}
              />

              {/* Potencia de aplicación */}
              <RangePicker
                name={t('LASER.POTENCIA.LABEL')}
                variable={potencia}
                setVariable={setPotencia}
                min={
                  (tipo != null && aplicador1?.modo instanceof AplicadorLaser 
                    && aplicador1?.modo.size != null && tipo == aplicador1?.modo.type) 
                  ? potencias[tipo][aplicador1?.modo.size].min : 0 
                }
                max={
                  (tipo != null && aplicador1?.modo instanceof AplicadorLaser 
                    && aplicador1?.modo.size != null && tipo == aplicador1?.modo.type)
                  ? potencias[tipo][aplicador1?.modo.size].max : 0 
                }
                step={
                  (tipo != null && aplicador1?.modo instanceof AplicadorLaser 
                    && aplicador1?.modo.size != null && tipo == aplicador1?.modo.type)
                  ? potencias[tipo][aplicador1?.modo.size].step : 0
                }
                disabled={tipo === null || aplicador1?.modo === null}
                unit={`${tipo == tipos.L_LLLT ? 'mW' : 'W'}`}
              />

              {/* Superficie tratada */}
              <RangePicker
                name={t('LASER.SUPERFICIE_TRATADA')}
                variable={superficie}
                setVariable={setSuperficie}
                min={superficie_tratada.min}
                max={superficie_tratada.max}
                step={superficie_tratada.step}
                unit='cm²'
                disabled={simulating}
              />

              {/* Dosis total */}
              <RangePicker
                name={t('LASER.DOSIS.LABEL')}
                variable={dosis}
                setVariable={setDosis}
                min={dosis_total.min}
                max={dosis_total.max}
                step={dosis_total.step}
                unit='J/cm²'
              />

              {/* Modo de emisión */}
              <ListPicker
                variable={emision}
                onChange={setEmision}
                label={t('LASER.EMISION.LABEL')}
                placeholder={t('LASER.EMISION.PH')}
                valueOptions={emiOptions}
                disabled={simulating && !paused}
              />

              {/* Frecuencia de pulso */}
              {emision == modos_emision.PULSADO &&
                <RangePicker
                  name={t('LASER.FRECUENCIA')}
                  variable={frecuenciaPulso}
                  setVariable={setFrecuenciaPulso}
                  min={tipo !== null ? frecuenciasPulso[tipo].min : 0 }
                  max={tipo !== null ? frecuenciasPulso[tipo].max : 0 }
                  step={tipo !== null ? frecuenciasPulso[tipo].step : 0}
                  disabled={tipo === null || emision != modos_emision.PULSADO 
                    || (simulating && !paused)
                  }
                  unit='Hz'
                />
              }

              {/* Tiempo de tratamiento */}
              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
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

export default LaserSimulacion;