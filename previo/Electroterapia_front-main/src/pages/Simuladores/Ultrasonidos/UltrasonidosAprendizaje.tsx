import './UltrasonidosAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { tramosOptions, valueOptions } from '../../../components/Logica/General';
import { ultrasonidos } from './Ultrasonidos';
import TimePicker from '../../../components/Pickers/TimePicker';
import ListPicker from '../../../components/Pickers/ListPicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import RangeColorPicker from '../../../components/Pickers/RangeColorPicker';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';

const UltrasonidosAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar
  } = useLog();
  
  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const [cabezal, setCabezal] = useState(null);
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
    setCabezal(null);
    setFrecuencia(null);
    setIntensidad(ultrasonidos.INTENSIDAD.min);
    setEmision(null);
    setRelacion(null);
    setTratamiento(new Time(0, 0));
    setDosisTotal(0);
    setSuperficie(ultrasonidos.SUPERFICIE.min);
    setDosisPorCm(0);
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones de ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const cabOptions = valueOptions('ULTRASONIDOS.CABEZAL.OPCIONES', t, ultrasonidos.CABEZAL, () => false);
  const conOptions = valueOptions('ULTRASONIDOS.CONDUCCION.OPCIONES', t, ultrasonidos.CONDUCCION, () => false);
  const frecOptions = valueOptions('ULTRASONIDOS.FRECUENCIA.OPCIONES', t, ultrasonidos.CONDUCCION, () => false);
  const emiOptions = valueOptions('ULTRASONIDOS.EMISION.OPCIONES', t, ultrasonidos.MODO_EMISION.values, () => false);
  const relOptions = valueOptions('ULTRASONIDOS.RELACION.OPCIONES', t, ultrasonidos.RELACION_PULSO, (idx: any) => idx == 0 && emision == ultrasonidos.MODO_EMISION.PULSADO);

  const tramosDosisMsg = tramosOptions('ULTRASONIDOS.DOSIS.SECCIONES', t);

  //////////////////////////////////////////////////////////////////////////////
  // Controla parámetros calculados automáticamente
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (cabezal == null || relacion == null) setDosisTotal(0);
    else setDosisTotal(intensidad * cabezal * tratamiento.toSeconds() * relacion)
  }, [dosisTotal, intensidad, cabezal, tratamiento, relacion])

  useEffect(() => {
    if (superficie == 0) setDosisPorCm(0);
    else setDosisPorCm(dosisTotal / superficie)
  }, [dosisPorCm, dosisTotal, superficie])

  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const iniciarTratamiento = () => {
    if (frecuencia == null) {
      present({ message: t('ULTRASONIDOS.ALERTAS.FRECUENCIA'), duration: 4000, cssClass: "error-toast" });
    } else if (emision == null) {
      present({ message: t('ULTRASONIDOS.ALERTAS.EMISION'), duration: 4000, cssClass: "error-toast" });
    } else if (relacion == null) {
      present({ message: t('ULTRASONIDOS.ALERTAS.RELACION'), duration: 4000, cssClass: "error-toast" });
    } else if (cabezal == null) {
      present({ message: t('ULTRASONIDOS.ALERTAS.CABEZAL'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('ULTRASONIDOS.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: {  } },
        Simuladores.ULTRASONIDOS
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
            <IonTitle> Ultrasonidos </IonTitle>
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
                disabled={simulating}
                infoMsg={t('ULTRASONIDOS.MSG_DOSIS_TOTAL')}
              />

              {/* Superficie tratada */}
              <RangePicker
                name={t('ULTRASONIDOS.SUPERFICIE_TRATADA')}
                variable={superficie}
                setVariable={setSuperficie}
                min={cabezal !== null ? cabezal : ultrasonidos.SUPERFICIE.min}
                max={ultrasonidos.SUPERFICIE.max}
                step={ultrasonidos.SUPERFICIE.step}
                unit='cm²'
                disabled={simulating}
              />

              {/* Dosis / cm² */}
              <RangeColorPicker
                name={t('ULTRASONIDOS.DOSIS.LABEL')}
                variable={dosisPorCm}
                setVariable={setDosisPorCm}
                min={ultrasonidos.SUPERFICIE_CM.min}
                max={ultrasonidos.SUPERFICIE_CM.max}
                step={ultrasonidos.SUPERFICIE_CM.step}
                unit='cm²'
                sections={[
                  { value: 10, color: constants.tramos.blanco, msg: tramosDosisMsg[0] },
                  { value: 20, color: constants.tramos.verdeClaro, msg: tramosDosisMsg[1] },
                  { value: 40, color: constants.tramos.verde, msg: tramosDosisMsg[2] },
                  { value: 50, color: constants.tramos.amarillo, msg: tramosDosisMsg[3] },
                  { value: 10800000, color: constants.tramos.rojo, msg: tramosDosisMsg[4] },
                ]}
                disabled={simulating}
              />

              {/* Botón de iniciar tratamiento */}
              <LogButton iniciar={iniciarTratamiento} />

              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('ULTRASONIDOS.MATERIALES')} </h2>
              {/* Cabezal */}
              <ListPicker
                variable={cabezal}
                onChange={setCabezal}
                label={t('ULTRASONIDOS.CABEZAL.LABEL')}
                placeholder={t('ULTRASONIDOS.CABEZAL.PH')}
                valueOptions={cabOptions}
                disabled={simulating}
              />

              {/* Conducción */}
              <ListPicker
                variable={0}
                onChange={setCabezal} // Nunca se va a usar
                label={t('ULTRASONIDOS.CONDUCCION.LABEL')}
                placeholder={t('ULTRASONIDOS.CONDUCCION.PH')}
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
                    {t(`ULTRASONIDOS.ULTRASONIDOS`)} 
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

export default UltrasonidosAprendizaje;