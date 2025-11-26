import './BifasicaSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateMaxAnchuraTren, formasOnda, maxAnchura, maxFrecuencia, maxFrecuenciaTrenes, maxIntensidad, minAnchura, minFrecuencia, minFrecuenciaTrenes, minIntensidad, stepAnchura, stepFrecuencia, stepFrecuenciaTrenes, stepIntensidad } from './Bifasica';
import { valueOptions } from '../../../components/Logica/General';
import TimePicker from '../../../components/Pickers/TimePicker';
import ListPicker from '../../../components/Pickers/ListPicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';
import TooglePicker from '../../../components/Pickers/TogglePicker';
import ImageMapper from '../../../components/ImageMapper/ImageMapper';

const BifasicaSimulacion: React.FC<{
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
  const [anchura, setAnchura] = useState<number>(minAnchura);
  const [frecuencia, setFrecuencia] = useState(minFrecuencia);
  const [frecuenciaTren, setFrecuenciaTren] = useState(2);
  const [anchuraTren, setAnchuraTren] = useState(0); // ms
  const minAnchuraTren = 0;
  const [maxAnchuraTren, setMaxAnchuraTren] = useState(0);
  const [formaOnda, setFormaOnda] = useState<any>(null);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  const [intensidad, setIntensidad] = useState(0);
  
  //////////////////////////////////////////////////////////////////////////////
  // Técnicas
  //////////////////////////////////////////////////////////////////////////////
  const [showTrenes, setShowTrenes] = useState(false);
  
  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {
    setAnchura(minAnchura);
    setFrecuencia(minFrecuencia);
    setFrecuenciaTren(2);
    setAnchuraTren(0); // ms
    setMaxAnchuraTren(0);
    setFormaOnda(null);
    setTratamiento(new Time(0, 0));
    setIntensidad(0);

    reset();
  })

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const formOptions = valueOptions('BIFASICA.FORMA_ONDA.OPCIONES', t, formasOnda.values, () => false);
  
  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return {
      intensidad, 
      frecuencia, 
      anchura,
      ...(showTrenes ? { frecuenciaTren, anchuraTren } : {}),
      formaOnda
    };
  };

  const iniciarTratamiento = () => {
    if (formaOnda == null) {
      present({ message: t('BIFASICA.ALERTAS.FORMA_ONDA'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('BIFASICA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento },
        { 
          time: Date.now(), 
          params: params()
        },
        Simuladores.BIFASICA
      )
    }
  }

  useEffect(() => {
    agregarParams({ time: Date.now(), params: params() })
  }, [
    intensidad, frecuencia, anchura, showTrenes, frecuenciaTren, anchuraTren, 
    formaOnda
  ])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t('BIFASICA.BIFASICA')} </IonTitle>
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
              <h2 className='negro'> {t('BIFASICA.PARAMETROS')} </h2>

              {/* Forma de onda */}
              <ListPicker
                variable={formaOnda}
                onChange={setFormaOnda}
                label={t('BIFASICA.FORMA_ONDA.LABEL')}
                placeholder={t('BIFASICA.FORMA_ONDA.PH')}
                valueOptions={formOptions}
                disabled={simulating && !paused}
              />

              {/* Anchura de pulso */}
              <RangePicker
                name={t('BIFASICA.ANCHURA')}
                variable={anchura}
                setVariable={setAnchura}
                min={minAnchura}
                max={maxAnchura}
                step={stepAnchura}
                unit='µs'
              />
              {/* Frecuencia */}
              <RangePicker
                name={t('BIFASICA.FRECUENCIA')}
                variable={frecuencia}
                setVariable={setFrecuencia}
                min={minFrecuencia}
                max={maxFrecuencia}
                step={stepFrecuencia}
                unit='Hz'
              />

              <TooglePicker
                name={t('BIFASICA.TENS_TRENES')}
                variable={showTrenes}
                onChange={() => setShowTrenes(!showTrenes)}
                disabled={simulating && !paused}
              />
              {showTrenes &&
                <>
                  {/* Frecuencia del tren */}
                  <RangePicker
                    name={t('BIFASICA.TRENES')}
                    variable={frecuenciaTren}
                    setVariable={(e) => {
                      setFrecuenciaTren(e);
                      setMaxAnchuraTren(calculateMaxAnchuraTren(e))
                    }}
                    min={minFrecuenciaTrenes}
                    max={maxFrecuenciaTrenes}
                    step={stepFrecuenciaTrenes}
                    unit='Hz'
                    disabled={simulating && !paused}
                  />

                  {/* Anchura del tren */}
                  <RangePicker
                    name={t('BIFASICA.ANCHURA_TREN')}
                    variable={anchuraTren}
                    setVariable={setAnchuraTren}
                    min={minAnchuraTren}
                    max={maxAnchuraTren}
                    step={1}
                    unit='ms'
                    disabled={simulating && !paused}
                  />
                </>
              }

              {/* Intensidad */}
              <RangePicker
                name={t('BIFASICA.INTENSIDAD')}
                variable={intensidad}
                setVariable={setIntensidad}
                min={minIntensidad}
                max={maxIntensidad}
                step={stepIntensidad}
                unit='mA'
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
              <ImageMapper/>
            </IonContent>
          </IonCol>
        </IonRow>  
      </IonContent>
    </IonPage>
  );
};

export default BifasicaSimulacion;
