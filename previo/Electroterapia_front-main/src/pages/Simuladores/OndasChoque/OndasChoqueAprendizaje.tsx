import './OndasChoqueAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLog } from '../../../context/logContext';
import { Simuladores, Time, Tramo } from '../../../constants/interfaces';
import { tramosOptions, valueOptions } from '../../../components/Logica/General';
import { ondaschoque } from './OndasChoque';
import constants from '../../../constants/constants';
import ListPicker from '../../../components/Pickers/ListPicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import RangeColorPicker from '../../../components/Pickers/RangeColorPicker';
import TimePicker from '../../../components/Pickers/TimePicker';
import LogButton from '../../../components/Logs/LogButton';

const OndasChoqueAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar
  } = useLog();
  
  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const [tipo, setTipo] = useState(null);
  const [aplicador, setAplicador] = useState(null);
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
    setAplicador(null);
    setFrecuencia(1);
    setPresion(0);
    setImpactos(0);
    setDosisTotal(0);
    setTratamiento(new Time(0, 0));
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const tipoOptions = valueOptions('ONDAS_CHOQUE.TIPOS.OPCIONES', t, ondaschoque.TIPO.values, () => false);
  const aplRadialOptions = valueOptions('ONDAS_CHOQUE.APLICADOR.OPCIONES_RADIAL', t, ondaschoque.APLICADOR.RADIAL.values, () => false);
  const aplFocalOptions = valueOptions('ONDAS_CHOQUE.APLICADOR.OPCIONES_FOCAL', t, ondaschoque.APLICADOR.FOCAL.values, () => false);
  const conOptions = valueOptions('ONDAS_CHOQUE.CONDUCCION.OPCIONES', t, ondaschoque.CONDUCCION, () => false);

  //////////////////////////////////////////////////////////////////////////////
  // Secciones
  //////////////////////////////////////////////////////////////////////////////
  const tramosImpactosMsg = tramosOptions('ONDAS_CHOQUE.IMPACTOS.SECCIONES', t);
  const tramosDosisMsg = tramosOptions('ONDAS_CHOQUE.DOSIS.SECCIONES', t);

  const sectionsFSWT: Tramo[] = [
    { value: 499, color: constants.tramos.blanco, msg: tramosDosisMsg[0] },
    { value: 999, color: constants.tramos.verdeClaro, msg: tramosDosisMsg[1] },
    { value: 2000, color: constants.tramos.verde, msg: tramosDosisMsg[2] },
    { value: 3000, color: constants.tramos.amarillo, msg: tramosDosisMsg[3] },
    { value: Infinity, color: constants.tramos.rojo, msg: tramosDosisMsg[4] },
  ];

  const sectionsRSWT: Tramo[] = [
    { value: 1999, color: constants.tramos.blanco, msg: tramosDosisMsg[0] },
    { value: 3999, color: constants.tramos.verdeClaro, msg: tramosDosisMsg[1] },
    { value: 8000, color: constants.tramos.verde, msg: tramosDosisMsg[2] },
    { value: 12000, color: constants.tramos.amarillo, msg: tramosDosisMsg[3] },
    { value: Infinity, color: constants.tramos.rojo, msg: tramosDosisMsg[4] },
  ];

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
  const iniciarTratamiento = () => {
    if (tipo == null) {
      present({ message: t('ONDAS_CHOQUE.ALERTAS.TIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (aplicador == null) {
      present({ message: t('ONDAS_CHOQUE.ALERTAS.APLICADOR'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('ONDAS_CHOQUE.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: {  } },
        Simuladores.ONDASCHOQUE
      )
    }
  }

  const [impactosPerSecond, setImpactosPerSecond] = useState<number>(0);
  useEffect(() => {
    setImpactosPerSecond(impactos / tratamiento.toSeconds());
  }, [tratamiento])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={constants.aprendizajeIcon}/>
            <IonTitle> Ondas de choque </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
            <IonContent>

              <ListPicker
                variable={tipo}
                onChange={(e: any) => {
                  setAplicador(null);
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
              <RangeColorPicker
                name={t('ONDAS_CHOQUE.IMPACTOS.LABEL')}
                variable={simulating 
                  ? impactos - (tratamiento.toSeconds() - tiempoRestante / 1000) * impactosPerSecond
                  : impactos}
                setVariable={setImpactos}
                min={ondaschoque.IMPACTOS.min}
                max={ondaschoque.IMPACTOS.max}
                step={ondaschoque.IMPACTOS.step}
                sections={[
                  {value: 500, color: constants.tramos.blanco, msg: tramosImpactosMsg[0]},
                  {value: 1000, color: constants.tramos.verde, msg: tramosImpactosMsg[1]},
                  {value: 3000, color: constants.tramos.verdeClaro, msg: tramosImpactosMsg[2]},
                  {value: 6000, color: constants.tramos.amarillo, msg: tramosImpactosMsg[3]},
                  {value: ondaschoque.IMPACTOS.max, color: constants.tramos.rojo, msg: tramosImpactosMsg[4]},
                ]}
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
                <RangeColorPicker
                  name={t('ONDAS_CHOQUE.DOSIS.LABEL')}
                  variable={dosisTotal}
                  setVariable={setDosisTotal}
                  min={ondaschoque.DOSIS.min}
                  max={ondaschoque.DOSIS.max}
                  step={ondaschoque.DOSIS.step}
                  unit={tipo == ondaschoque.TIPO.FOCAL ? 'mJ/mm²' 
                    : tipo == ondaschoque.TIPO.RADIAL ? "imp.×Bar" : ""}
                  sections={
                    tipo == ondaschoque.TIPO.FOCAL ? sectionsFSWT
                    : tipo == ondaschoque.TIPO.RADIAL ? sectionsRSWT
                    : []
                  }
                  disabled={simulating}
                />
              }

              {/* Botón de iniciar tratamiento */}
              <LogButton iniciar={iniciarTratamiento} />

              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('ONDAS_CHOQUE.MATERIALES')} </h2>

              <ListPicker
                variable={aplicador}
                onChange={setAplicador}
                label={t('ONDAS_CHOQUE.APLICADOR.LABEL')}
                placeholder={t('ONDAS_CHOQUE.APLICADOR.PH')}
                valueOptions={
                  tipo == ondaschoque.TIPO.RADIAL ? aplRadialOptions :
                  tipo == ondaschoque.TIPO.FOCAL ? aplFocalOptions : []
                }
                disabled={tipo == null || simulating}
              />

              <ListPicker
                variable={0}
                onChange={setAplicador} // Nunca se va a usar
                label={t('ONDAS_CHOQUE.CONDUCCION.LABEL')}
                placeholder={t('ONDAS_CHOQUE.CONDUCCION.PH')}
                valueOptions={conOptions}
                disabled={true}
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
                  <h2 className='modo-titulo ion-text-center'> 
                    {t(`ONDAS_CHOQUE.ONDAS_CHOQUE`)} 
                  </h2>
                </IonCardHeader>
                <IonCardContent>  
                  <IonText className='ion-no-margin ion-no-padding'>
                    <h3 className='ion-margin-start'> {t("GALVANICA.CONCEPTO")} </h3>
                    <p className='explicacion ion-margin-start'>
                        {t(`GALVANICA.CONCEPTO_TEXTO`)}
                    </p>

                    <h3 className='ion-margin-start'> {t("GALVANICA.BASES_FISICAS.TITULO")} </h3>
                    <p className='ion-margin-start'>
                      {t(`GALVANICA.BASES_FISICAS.TEXTO`)}
                    </p>

                    <h3 className='ion-margin-start'> {t("GALVANICA.EFECTOS_FISIOLOGICOS.TITULO")} </h3>
                    <p className='ion-margin-start'>
                      <Trans 
                        i18nKey={"GALVANICA.EFECTOS_FISIOLOGICOS.P1"} 
                        components={{ strong: <strong />, ol: <ol />, ul: <ul />, li: <li /> }} 
                      />

                      <Trans 
                        i18nKey={"GALVANICA.EFECTOS_FISIOLOGICOS.P2"} 
                        components={{ strong: <strong />, ol: <ol />, ul: <ul />, li: <li /> }} 
                      />
                    </p>

                    <h3 className='ion-margin-start'> {t("GALVANICA.USO_CLINICO.TITULO")} </h3>
                    <p className='ion-margin-start'>
                      <Trans 
                        i18nKey={"GALVANICA.USO_CLINICO.TEXTO"} 
                        components={{ strong: <strong />, ol: <ol />, ul: <ul />, li: <li /> }} 
                      />
                    </p>

                    <h3 className='ion-margin-start'> {t("GALVANICA.CONTRAINDICACIONES.TITULO")} </h3>
                    <p className='ion-margin-start'>
                      <Trans 
                        i18nKey={"GALVANICA.CONTRAINDICACIONES.TEXTO"} 
                        components={{ strong: <strong />, ol: <ol />, ul: <ul />, li: <li /> }} 
                      />
                    </p>

                    <h3 className='ion-margin-start'> {t("GALVANICA.FORMA_APLICACION_GENERAL.TITULO")} </h3>
                    <p className='ion-margin-start'>
                      <Trans 
                        i18nKey={"GALVANICA.FORMA_APLICACION_GENERAL.TEXTO"} 
                        components={{ strong: <strong />, ol: <ol />, ul: <ul />, li: <li /> }} 
                      />
                    </p>
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

export default OndasChoqueAprendizaje;