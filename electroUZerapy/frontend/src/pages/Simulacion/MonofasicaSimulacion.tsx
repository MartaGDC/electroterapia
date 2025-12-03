import './MonofasicaSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { anchuras, anchuras_pausa, formasOnda, maxFrecuencia, maxIntensidad, minFrecuencia, minIntensidad, stepFrecuencia, stepIntensidad } from '../../classes/Monofasica';
import ListPicker from '../../components/Pickers/ListPicker';
import RangePicker from '../../components/Pickers/RangePicker';
import TimePicker from '../../components/Pickers/TimePicker';
import constants from '../../constants/constants';
import { Simuladores, Time } from '../../constants/interfaces';
import RangeMagnitudesPicker from '../../components/Pickers/RangeMagnitudesPicker';
import { valueOptions } from '../../components/Logica/General';
import ImageMapper from '../../components/ImageMapper/ImageMapper';
import { useLog } from '../../context/logContext';
import LogButton from '../../components/Logs/LogButton';

const MonofasicaSimulacion: React.FC<{
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
  // Parámetros fijos
  //////////////////////////////////////////////////////////////////////////////
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));

  // Parámetros
  const [anchura, setAnchura] = useState<number>(anchuras[0].min);
  const [magnitudAnchura, setMagnitudAnchura] = useState(anchuras[0].value);

  const [tiempoPausa, setTiempoPausa] = useState(minFrecuencia);
  const [magnitudTiempoPausa, setMagnitudTiempoPausa] = useState(anchuras_pausa[0].value);

  const [frecuencia, setFrecuencia] = useState<number>(minFrecuencia);

  const [formaOnda, setFormaOnda] = useState<any>(null);
  const [intensidad, setIntensidad] = useState(0);
  
  // Otros
  const [minAnchura, setMinAnchura] = useState(anchuras[0].min)
  const [maxAnchura, setMaxAnchura] = useState(anchuras[0].max)

  // Options para list pickers
  const formOptions = valueOptions('MONOFASICA.FORMA_ONDA.OPCIONES', t, formasOnda.values, () => false);

  const anchurasOptions = anchuras.map((el, idx) => (
    { name: anchuras[idx].name, value: anchuras[idx].value, disabled: false }
  )) 

  const anchurasPausaOptions = anchuras_pausa.map((el, idx) => (
    { name: anchuras_pausa[idx].name, value: anchuras_pausa[idx].value, disabled: false }
  )) 

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {
  
    setAnchura(anchuras[0].min);
    setMagnitudAnchura(anchuras[0].value);
  
    setTiempoPausa(minFrecuencia);
    setMagnitudTiempoPausa(anchuras_pausa[0].value);
  
    setFrecuencia(minFrecuencia);
  
    setFormaOnda(null);
    setTratamiento(new Time(0, 0));
    setIntensidad(0);
      
    // Otros
    setMinAnchura(anchuras[0].min);
    setMaxAnchura(anchuras[0].max);

    reset();
  });

  //////////////////////////////////////////////////////////////////////////////
  // Cambio de parámetros
  //////////////////////////////////////////////////////////////////////////////
  const changeFrecuencia = (
    newFrec: number,
    anch: number = anchura,
    magnAnchura: number = magnitudAnchura,
  ) => {
    setFrecuencia(newFrec);
    const newTiempoPausa = (1 / newFrec) - anch / (magnAnchura == 0 ? 1e6 : 1e3);

    if (newTiempoPausa >= 0) {
      if (newTiempoPausa < 1) {
        setTiempoPausa(Math.round(newTiempoPausa * 1e3 * 100) / 100);
        setMagnitudTiempoPausa(0); // ms
      } else {
        setTiempoPausa(Math.round(newTiempoPausa * 100) / 100);
        setMagnitudTiempoPausa(1); // s
      }  
    } else {
      const conversionAnchura = magnAnchura == anchuras[0].value ? 1e-6 : 1e-3;
      const conversionPausa = magnitudTiempoPausa == anchuras_pausa[0].value ? 1e-3
        : magnitudTiempoPausa == anchuras[1].value ? 1
        : magnitudTiempoPausa == anchuras[0].value ? 1e-3
        : 1;
      const newFrecuencia = 1 / (anchura * conversionAnchura + tiempoPausa * conversionPausa);
      setFrecuencia(newFrecuencia);
    }
  }

  const changeTiempoPausa = (
    time: number, 
    magnitud: number = -1,
    anch: number = anchura,
    magnAnchura: number = magnitudAnchura,
  ) => {
    setTiempoPausa(time);
    const conversionAnchura = magnAnchura == anchuras[0].value ? 1e-6 : 1e-3;
    const conversionPausa = magnitud == anchuras_pausa[0].value ? 1e-3
      : magnitud == anchuras[1].value ? 1
      : magnitudTiempoPausa == anchuras[0].value ? 1e-3
      : 1;

    const newFrecuencia = 1 / (anch * conversionAnchura + time * conversionPausa);
    console.log(newFrecuencia)
    setFrecuencia(newFrecuencia)
  }

  useEffect(() => {
    changeFrecuencia(minFrecuencia, minAnchura, 0);
  }, [])

  //////////////////////////////////////////////////////////////////////////////
  // Funciones: Generación de logs
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return {
      intensidad, 
      frecuencia, 
      anchura: anchura / (magnitudAnchura == 0 ? 1000 : 1), // ms
      formaOnda, 
      tiempoPausa: tiempoPausa / (magnitudTiempoPausa == 0 ? 1000 : 1), // s
    }
  }
  const iniciarTratamiento = async () => {
    if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('MONOFASICA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" })
    } else if (formaOnda == null) {
      present({ message: t('MONOFASICA.ALERTAS.FORMA_ONDA'), duration: 4000, cssClass: "error-toast" })
    } else {
      iniciar(
        type,
        tratamiento,
        { tratamiento },
        { 
          time: Date.now(), 
          params: params()
        },
        Simuladores.MONOFASICA
      );
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  // Registro de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (simulating) {
      agregarParams({ 
        time: Date.now(), 
        params: params()
      })
    }
  }, [intensidad, formaOnda, anchura, magnitudAnchura, tiempoPausa, magnitudTiempoPausa, frecuencia]);
  
  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t('MONOFASICA.MONOFASICA')} </IonTitle>
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
              <h2 className='negro'> {t('MONOFASICA.PARAMETROS')} </h2>

              {/* Forma de onda */}
              <ListPicker
                variable={formaOnda}
                onChange={setFormaOnda}
                label={t('MONOFASICA.FORMA_ONDA.LABEL')}
                placeholder={t('MONOFASICA.FORMA_ONDA.PH')}
                valueOptions={formOptions}
                disabled={simulating && !paused}
              />
              
              {/* Anchura de pulso */}
              <RangeMagnitudesPicker
                name={t('MONOFASICA.ANCHURA')}
                variable={anchura}
                setVariable={(e) => {
                  setAnchura(e);
                  changeFrecuencia(frecuencia, e);
                }}
                min={anchuras[magnitudAnchura].min}
                max={anchuras[magnitudAnchura].max}
                step={anchuras[magnitudAnchura].step}
                magnitude={magnitudAnchura}
                setMagnitude={setMagnitudAnchura}
                valueOptions={anchurasOptions}
              />

              {/* Frecuencia */}
              <RangePicker
                name={t('MONOFASICA.FRECUENCIA')}
                variable={frecuencia}
                setVariable={changeFrecuencia}
                unit='Hz'
                min={minFrecuencia}
                max={maxFrecuencia}
                step={stepFrecuencia}
              />

              {/* Anchura de pausa */}
              <RangeMagnitudesPicker
                name={t('MONOFASICA.DURACION_PAUSA')}
                variable={tiempoPausa}
                setVariable={changeTiempoPausa}
                min={anchuras_pausa[magnitudTiempoPausa].min}
                max={anchuras_pausa[magnitudTiempoPausa].max}
                step={anchuras_pausa[magnitudTiempoPausa].step}
                magnitude={magnitudTiempoPausa}
                setMagnitude={setMagnitudTiempoPausa}
                valueOptions={anchurasPausaOptions}
                disabled={simulating && !paused}
              />

              {/* Intensidad */}
              <RangePicker
                name={t('MONOFASICA.INTENSIDAD.INTENSIDAD')}
                variable={intensidad}
                setVariable={setIntensidad}
                unit='mA'
                min={minIntensidad}
                max={maxIntensidad}
                step={stepIntensidad}
              />

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

export default MonofasicaSimulacion;