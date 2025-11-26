import './LaserAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { aplicadores_HILT, aplicadores_LLLT, dosis_total, frecuenciasPulso, longitudesOnda, modos_emision, potencias, superficie_tratada, tipos } from './Laser';
import TimePicker from '../../../components/Pickers/TimePicker';
import ListPicker from '../../../components/Pickers/ListPicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { msgArray, tramosOptions, valueOptions } from '../../../components/Logica/General';
import RangeColorPicker from '../../../components/Pickers/RangeColorPicker';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';

const LaserAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar
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
  const [aplicador, setAplicador] = useState(null);
  
  const [tipo, setTipo] = useState(null);

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const tiposOptions = valueOptions('LASER.TIPOS.OPCIONES', t, tipos.values, () => false);
  const longOptions = valueOptions('LASER.LONGITUD_ONDA.OPCIONES', t, longitudesOnda.values, (idx: number) => {return longitudesOnda.values[idx] == longitudesOnda.HILT.value ? true : false});
  const emiOptions = valueOptions('LASER.EMISION.OPCIONES', t, modos_emision.values, () => false);
  const aplicadorLLLTOptions = valueOptions('LASER.APLICADOR.OPCIONES_LLLT', t, aplicadores_LLLT.values, () => false);
  const aplicadorHILTOptions = valueOptions('LASER.APLICADOR.OPCIONES_HILT', t, aplicadores_HILT.values, () => false);

  const tramosDosisMsg = tramosOptions('LASER.DOSIS.SECCIONES', t);
  const infoDosis = msgArray('LASER.DOSIS.FORMULA', t);

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
    setAplicador(null);
    setTipo(null);
  });

  const cambiarTipo = (tec: any) => {
    setTipo(tec);
    setAplicador(null);

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
  const iniciarTratamiento = () => {
    if (tipo == null) {
      present({ message: t('LASER.ALERTAS.TIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (longitudOnda == null) {
      present({ message: t('LASER.ALERTAS.LONGITUD'), duration: 4000, cssClass: "error-toast" });
    } else if (aplicador == null) {
      present({ message: t('LASER.ALERTAS.APLICADOR'), duration: 4000, cssClass: "error-toast" });
    } else if (emision == null) {
      present({ message: t('LASER.ALERTAS.EMISION'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('LASER.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: {  } },
        Simuladores.LASER
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
            <IonTitle> Láser </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
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
                min={(tipo != null && aplicador != null) ? potencias[tipo][aplicador].min : 0 }
                max={(tipo != null && aplicador != null) ? potencias[tipo][aplicador].max : 0 }
                step={(tipo != null && aplicador != null) ? potencias[tipo][aplicador].step : 0}
                disabled={tipo === null || aplicador === null}
                unit={`${tipo == tipos.L_LLLT ? 'mW' : 'W'}`}
                infoMsg={t('LASER.POTENCIA.MSG')}
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
              <RangeColorPicker
                name={t('LASER.DOSIS.LABEL')}
                variable={dosis}
                setVariable={setDosis}
                min={dosis_total.min}
                max={dosis_total.max}
                step={dosis_total.step}
                unit='J/cm²'
                sections={[
                  { value: 5, color: constants.tramos.blanco, msg: tramosDosisMsg[0] },
                  { value: 9, color: constants.tramos.verdeClaro, msg: tramosDosisMsg[1] },
                  { value: 15, color: constants.tramos.verde, msg: tramosDosisMsg[2] },
                  { value: 25, color: constants.tramos.amarillo, msg: tramosDosisMsg[3] },
                  { value: Infinity, color: constants.tramos.rojo, msg: tramosDosisMsg[4] },
                ]}
                infoMsg={infoDosis}
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
                infoMsg={t('LASER.TIEMPO_MSG')}
              />

              {/* Botón de iniciar tratamiento */}
              <LogButton iniciar={iniciarTratamiento} />

              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('LASER.MATERIALES')} </h2>
              <IonItem className='gafas-proteccion' lines='full'>
                <p> 
                  {t('LASER.GAFAS')} 
                  {longitudOnda == longitudesOnda.LLLT_ROJO.value
                    ? ` ${longitudesOnda.LLLT_ROJO.min}-${longitudesOnda.LLLT_ROJO.max}nm`
                    : longitudOnda == longitudesOnda.LLLT_INFRARROJO.value
                    ? ` ${longitudesOnda.LLLT_INFRARROJO.min}-${longitudesOnda.LLLT_INFRARROJO.max}nm`
                    : longitudOnda == longitudesOnda.HILT.value
                    ? ` ${longitudesOnda.HILT.min}-${longitudesOnda.HILT.max}nm`
                    : ""
                  }
                </p>
              </IonItem>

              <ListPicker
                variable={aplicador}
                onChange={setAplicador}
                label={t('LASER.APLICADOR.LABEL')}
                placeholder={t('LASER.APLICADOR.PH')}
                valueOptions={
                  tipo == tipos.L_LLLT ? aplicadorLLLTOptions 
                  : tipo == tipos.L_HILT ? aplicadorHILTOptions : []
                }
                disabled={tipo == null || simulating}
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
                    {t(`LASER.LASER`)} 
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

export default LaserAprendizaje;