import './OndasChoqueSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ondaschoque } from '../../classes/OndasChoque';
import TimePicker from '../../components/Pickers/TimePicker';
import ListPicker from '../../components/Pickers/ListPicker';
import RangePicker from '../../components/Pickers/RangePicker';
import constants from '../../constants/constants';
import { Simuladores, Time } from '../../constants/interfaces';
import { valueOptions } from '../../components/Logica/General';
import { useLog } from '../../context/logContext';
import LogButton from '../../components/Logs/LogButton';
import ImageMapper from '../../components/ImageMapper/ImageMapper';

const OndasChoqueSimulacion: React.FC<{
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
  const [tipo, setTipo] = useState(null);
  const [frecuencia, setFrecuencia] = useState(1);
  const [presion, setPresion] = useState(0);
  const [impactos, setImpactos] = useState(0);
  const [dosisTotal, setDosisTotal] = useState(0);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  
  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {    
    setTipo(null);
    setFrecuencia(1);
    setPresion(0);
    setImpactos(0);
    setDosisTotal(0);
    setTratamiento(new Time(0, 0));
    
    reset();
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const tipoOptions = valueOptions('ONDAS_CHOQUE.TIPOS.OPCIONES', t, ondaschoque.TIPO.values, () => false);

  //////////////////////////////////////////////////////////////////////////////
  // Cálculo automático de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (frecuencia == 0) {
      setTratamiento(new Time(0,0));
    } else {
      setTratamiento(
        new Time(
          Math.floor((impactos / frecuencia) / 60), 
          Math.floor((impactos / frecuencia) % 60)
        )
      );
    }
  }, [frecuencia, impactos])
  
  useEffect(() => {
    if (tipo == null) setDosisTotal(0);
    else setDosisTotal(impactos * presion);
  }, [dosisTotal, tipo, impactos, presion])
  
  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return {
      presion, 
      frecuencia
    }
  }

  const iniciarTratamiento = () => {
    if (tipo == null) {
      present({ message: t('ONDAS_CHOQUE.ALERTAS.TIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('ONDAS_CHOQUE.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento, tipo, impactos, dosisTotal },
        { time: Date.now(), params: params() },
        Simuladores.ONDASCHOQUE
      )
    }
  }

  useEffect(() => {
    agregarParams({ time: Date.now(), params: params() })
  }, [presion, frecuencia])

  const impactosPerSecond = useRef<number>(0);
  useEffect(() => {
    impactosPerSecond.current = impactos / tratamiento.toSeconds();
  }, [tratamiento])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t('ONDAS_CHOQUE.ONDAS_CHOQUE')} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColSimulacion} className='ion-padding ion-no-margin'>
            <IonContent>

              <ListPicker
                variable={tipo}
                onChange={(e: any) => {
                  setTipo(e);                
                }}
                label={t('ONDAS_CHOQUE.TIPOS.LABEL')}
                placeholder={t('ONDAS_CHOQUE.TIPOS.PH')}
                valueOptions={tipoOptions}
                disabled={simulating}
              />

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('ONDAS_CHOQUE.PARAMETROS')} </h2>
              
              {/* Frecuencia */}
              <RangePicker
                name={t('ONDAS_CHOQUE.FRECUENCIA')}
                variable={frecuencia}
                setVariable={setFrecuencia}
                min={tipo == null ? 0 : ondaschoque.FRECUENCIA[tipo].min}
                max={tipo == null ? 0 : ondaschoque.FRECUENCIA[tipo].max}
                step={tipo == null ? 0 : ondaschoque.FRECUENCIA[tipo].step}
                unit='Hz'
                disabled={simulating && !paused}
              />

              {/* Presión / Energía */}
              <RangePicker
                name={t('ONDAS_CHOQUE.PRESION')}
                variable={presion}
                setVariable={setPresion}
                min={tipo == null ? 0 : ondaschoque.PRESION[tipo].min}
                max={tipo == null ? 0 : ondaschoque.PRESION[tipo].max}
                step={tipo == null ? 0 : ondaschoque.PRESION[tipo].step}
                unit={`${tipo == ondaschoque.TIPO.RADIAL ? 'Bar' : 'mJ/mm²'}`}
              />

              {/* Número de impactos */}
              <RangePicker
                name={t('ONDAS_CHOQUE.IMPACTOS.LABEL')}
                variable={simulating 
                  ? impactos - (tratamiento.toSeconds() - tiempoRestante / 1000) * impactosPerSecond.current
                  : impactos}
                setVariable={setImpactos}
                min={ondaschoque.IMPACTOS.min}
                max={ondaschoque.IMPACTOS.max}
                step={ondaschoque.IMPACTOS.step}
                disabled={simulating}
                unit='imp.'
              />

              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
                disabled={true}
              />

              {tipo != null &&
                <RangePicker
                  name={t('ONDAS_CHOQUE.DOSIS.LABEL')}
                  variable={dosisTotal}
                  setVariable={setDosisTotal}
                  min={ondaschoque.DOSIS.min}
                  max={ondaschoque.DOSIS.max}
                  step={ondaschoque.DOSIS.step}
                  unit={tipo == ondaschoque.TIPO.FOCAL ? 'mJ/mm²' 
                    : tipo == ondaschoque.TIPO.RADIAL ? "imp.×Bar" : ""}
                  disabled={simulating}
                />
              }

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

export default OndasChoqueSimulacion;