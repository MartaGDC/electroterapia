import './UVSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { valueOptions } from '../../../components/Logica/General';
import { irradiancias, maxDistancia, maxRadiacion, minDistancia, minRadiacion, stepDistancia, stepRadiacion, tipo_radiacion } from './UV';
import TimePicker from '../../../components/Pickers/TimePicker';
import ListPicker from '../../../components/Pickers/ListPicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';
import ImageMapper from '../../../components/ImageMapper/ImageMapper';

const UVSimulacion: React.FC<{
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
  const [radiacion, setRadiacion] = useState<any>(0);
  const [distancia, setDistancia] = useState(maxDistancia);
  const [irradiancia, setIrradiancia] = useState(irradiancias[irradiancias.length-1].value);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  
  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {    
    setTipo(null);
    setRadiacion(0);
    setDistancia(maxDistancia);
    setIrradiancia(irradiancias[irradiancias.length-1].value);
    setTratamiento(new Time(0, 0));

    reset();
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const equiOptions = valueOptions('ULTRAVIOLETAS.EQUIPO.OPCIONES', t, tipo_radiacion.values, () => false);

  //////////////////////////////////////////////////////////////////////////////
  // Controlar variables que se calculan automáticamente
  //////////////////////////////////////////////////////////////////////////////
  // Calucla la irradiancia estimada
  useEffect(() => {
    const idx = irradiancias.findIndex((i) => distancia <= i.maxDist);
    if (idx != -1) setIrradiancia(irradiancias[idx].value);
  }, [distancia])

  // Calcula automáticamente el tiempo de tratamiento
  useEffect(() => {
    // Tiempo (s) = Dosis (J/cm²) / Irradiancia estimada (W/cm²)
    const tiempo = radiacion / (irradiancia / 1000);
    setTratamiento(new Time(0, tiempo));
  }, [radiacion, irradiancia])
  
  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return { distancia }
  }

  const iniciarTratamiento = () => {
    if (tipo == null) {
      present({ message: t('ULTRAVIOLETAS.ALERTAS.EQUIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('ULTRAVIOLETAS.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento, tipo, radiacion, irradiancia },
        { time: Date.now(), params: params() },
        Simuladores.ULTRAVIOLETAS
      )
    }
  }

  useEffect(() => {
    agregarParams({ time: Date.now(), params: params() })
  }, [distancia])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t('ULTRAVIOLETAS.ULTRAVIOLETAS')} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColSimulacion} className='ion-padding ion-no-margin'>
            <IonContent>
              {/* Tipo / Equipo */}
              <ListPicker
                variable={tipo}
                onChange={setTipo}
                label={t('ULTRAVIOLETAS.EQUIPO.LABEL')}
                placeholder={t('ULTRAVIOLETAS.EQUIPO.PH')}
                valueOptions={equiOptions}
                disabled={simulating}
              />

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('ULTRAVIOLETAS.PARAMETROS')} </h2>

              {/* Longitud de onda */}
              <RangePicker
                name={t('ULTRAVIOLETAS.LONGITUD_ONDA')}
                variable={
                  tipo == tipo_radiacion.UV_A.value ? tipo_radiacion.UV_A.longitudOnda :
                  tipo == tipo_radiacion.UV_B.value ? tipo_radiacion.UV_B.longitudOnda : 0
                }
                setVariable={() => {}} // Nunca se usará
                min={0}
                max={500}
                step={0}
                disabled={true}
                unit='nm'
              />

              {/* Dosis de radiación UV */}
              <RangePicker
                name={t('ULTRAVIOLETAS.DOSIS.LABEL')}
                variable={radiacion}
                setVariable={setRadiacion}
                min={minRadiacion}
                max={maxRadiacion}
                step={stepRadiacion}
                unit='J/cm²'
                disabled={simulating}
              />

              {/* Distancia aplicador-piel */}
              <RangePicker
                name={t('ULTRAVIOLETAS.DISTANCIA.LABEL')}
                variable={distancia}
                setVariable={setDistancia}
                min={minDistancia}
                max={maxDistancia}
                step={stepDistancia}
                unit='cm'
              />

              {/* Irradiancia estimada */}
              <RangePicker
                name={t('ULTRAVIOLETAS.IRRADIANCIA')}
                variable={irradiancia}
                setVariable={setIrradiancia}
                min={1}
                max={5}
                step={0.5}
                disabled={true}
                unit='mW/cm²'
              />

              {/* Tiempo de tratamiento */}
              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
                disabled={true}
              />

              {/* Botón de iniciar tratamiento */}
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

export default UVSimulacion;