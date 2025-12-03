import './MagnetoterapiaSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { valueOptions } from '../../components/Logica/General';
import { intensidades, maxDistancia, maxFrecuencia, minDistancia, minFrecuencia, minIntensidad, modos_emision, stepDistancia, stepFrecuencia, tipo_frecuencia, tipos } from '../../classes/Magnetoterapia';
import TimePicker from '../../components/Pickers/TimePicker';
import ListPicker from '../../components/Pickers/ListPicker';
import RangePicker from '../../components/Pickers/RangePicker';
import BarridoPicker from '../../components/Pickers/BarridoPicker';
import constants from '../../constants/constants';
import { Simuladores, Time } from '../../constants/interfaces';
import { useLog } from '../../context/logContext';
import LogButton from '../../components/Logs/LogButton';
import ImageMapper from '../../components/ImageMapper/ImageMapper';

const MagnetoterapiaSimulacion: React.FC<{
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
  const [tipo, setTipo] = useState<any>(null);
  const [aplicador, setAplicador] = useState<null | number>(null);
  const [intensidad, setIntensidad] = useState(minIntensidad);
  const [frecuencia, setFrecuencia] = useState(minFrecuencia);
  const [distancia, setDistancia] = useState(minDistancia);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  const [emision, setEmision] = useState(null);
  const [barrido, setBarrido] = useState({lower: minFrecuencia, upper: maxFrecuencia});
  const [tipoFrecuencia, setTipoFrecuencia] = useState(tipo_frecuencia.FIJA);

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {    
    setTipo(null);
    setAplicador(null);
    setIntensidad(minIntensidad);
    setFrecuencia(minFrecuencia);
    setDistancia(minDistancia);
    setTratamiento(new Time(0, 0));
    setEmision(null);
    setBarrido({lower: minFrecuencia, upper: maxFrecuencia});
    setTipoFrecuencia(tipo_frecuencia.FIJA);

    reset();
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const tipoOptions = valueOptions('MAGNETOTERAPIA.TIPOS.OPCIONES', t, tipos.values, () => false);
  const emiOptions = valueOptions('MAGNETOTERAPIA.EMISION.OPCIONES', t, modos_emision.values, () => false);
  const tipoFrecOptions = valueOptions('MAGNETOTERAPIA.TIPO_FRECUENCIA.OPCIONES', t, tipo_frecuencia.values, () => false);
  
  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return {
      intensidad,
      emision, 
      ...(emision == modos_emision.PULSADO
        ? {
            frecuencia,
            ...(tipoFrecuencia == tipo_frecuencia.BARRIDO
              ? {
                  barrido
                }
              : {}
            )
          }
        : {}
      )
    }
  }

  const iniciarTratamiento = () => {
    if (tipo == null) {
      present({ message: t('MAGNETOTERAPIA.ALERTAS.TIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (emision == null) {
      present({ message: t('MAGNETOTERAPIA.ALERTAS.EMISION'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('MAGNETOTERAPIA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento, distancia, tipo },
        { time: Date.now(), params: params() },
        Simuladores.MAGNETOTERAPIA
      )
    }
  }

  useEffect(() => {
    agregarParams({ time: Date.now(), params: params() })
  }, [intensidad, emision, frecuencia, tipoFrecuencia, barrido])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t('MAGNETOTERAPIA.MAGNETOTERAPIA')} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
            <IonContent>
              {/* Tipos de magnetoterapia */}
              <ListPicker
                variable={tipo}
                onChange={(t: any) => {
                  setTipo(t);
                  setAplicador(t == tipos.SUPERINDUCTIVO ? 0 : null);
                }}
                label={t('MAGNETOTERAPIA.TIPOS.LABEL')}
                placeholder={t('MAGNETOTERAPIA.TIPOS.PH')}
                valueOptions={tipoOptions}
                disabled={simulating}
              />

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('MAGNETOTERAPIA.PARAMETROS')} </h2>
              {/* Intensidad */}
              <RangePicker
                name={t('MAGNETOTERAPIA.INTENSIDAD')}
                variable={intensidad}
                setVariable={setIntensidad}
                min={tipo == null ? 0 : intensidades[tipo].min}
                max={tipo == null ? 0 : intensidades[tipo].max}
                step={tipo == null ? 0 : intensidades[tipo].step}
                unit={`${tipo == tipos.SUPERINDUCTIVO ? 'Teslas' : 'Gauss'}`}
              />

              {/* Modo de emisión */}
              <ListPicker
                variable={emision}
                onChange={setEmision}
                label={t('MAGNETOTERAPIA.EMISION.LABEL')}
                placeholder={t('MAGNETOTERAPIA.EMISION.PH')}
                valueOptions={emiOptions}
                disabled={simulating && !paused}
              />

              {/* Frecuencia */}
              {emision == modos_emision.PULSADO &&
                <RangePicker
                  name={t('MAGNETOTERAPIA.FRECUENCIA')}
                  variable={frecuencia}
                  setVariable={setFrecuencia}
                  min={minFrecuencia}
                  max={maxFrecuencia}
                  step={stepFrecuencia}
                  unit='Hz'
                  disabled={simulating && !paused}
                />
              }

              {emision == modos_emision.PULSADO &&
                <>
                  <ListPicker
                    variable={tipoFrecuencia}
                    onChange={setTipoFrecuencia}
                    label={t('MAGNETOTERAPIA.TIPO_FRECUENCIA.LABEL')}
                    placeholder={t('MAGNETOTERAPIA.TIPO_FRECUENCIA.PH')}
                    valueOptions={tipoFrecOptions}
                    disabled={simulating && !paused}
                  />

                  {tipoFrecuencia == tipo_frecuencia.BARRIDO &&
                    <BarridoPicker
                      name={t('MAGNETOTERAPIA.BARRIDO')}
                      variable={barrido}
                      setVariable={setBarrido}
                      midValue={frecuencia}
                      min={minFrecuencia}
                      max={maxFrecuencia}
                      step={stepFrecuencia}
                      disabled={simulating && !paused}
                    />
                  }
                </>
              }

              {/* Distancia aplicador-piel */}
              <RangePicker
                name={t('MAGNETOTERAPIA.DISTANCIA')}
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

              {/* Botón de iniciar tratamiento */}
              <LogButton iniciar={iniciarTratamiento} />
            </IonContent>
          </IonCol>
          {/* Parte derecha */}
          <IonCol size={constants.dchColAprendizaje} className='cuerpo ion-no-padding ion-no-margin'>
            <IonContent>
              <ImageMapper />
            </IonContent>
          </IonCol>
        </IonRow>  
      </IonContent>
    </IonPage>
  );
};

export default MagnetoterapiaSimulacion;