import './UVAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { tramosOptions, valueOptions } from '../../components/Logica/General';
import { irradiancias, maxDistancia, maxRadiacion, minDistancia, minRadiacion, stepDistancia, stepRadiacion, tipo_radiacion } from '../../classes/UV';
import TimePicker from '../../components/Pickers/TimePicker';
import ListPicker from '../../components/Pickers/ListPicker';
import RangePicker from '../../components/Pickers/RangePicker';
import RangeColorPicker from '../../components/Pickers/RangeColorPicker';
import constants from '../../constants/constants';
import { Simuladores, Time } from '../../constants/interfaces';
import { useLog } from '../../context/logContext';
import LogButton from '../../components/Logs/LogButton';
import ButtonCalculadora from '../../components/UV/Calculadora';

const UVAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, tiempoRestante, iniciar
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
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const equiOptions = valueOptions('ULTRAVIOLETAS.EQUIPO.OPCIONES', t, tipo_radiacion.values, () => false);

  const tramosDistMsg = tramosOptions('ULTRAVIOLETAS.DISTANCIA.SECCIONES', t);
  const tramosDosisMsg = tramosOptions('ULTRAVIOLETAS.DOSIS.SECCIONES', t);

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
  const iniciarTratamiento = () => {
    if (tipo == null) {
      present({ message: t('ULTRAVIOLETAS.ALERTAS.EQUIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('ULTRAVIOLETAS.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: {  } },
        Simuladores.ULTRAVIOLETAS
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
            <IonTitle> Ultravioletas </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
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
              <RangeColorPicker
                name={t('ULTRAVIOLETAS.DOSIS.LABEL')}
                variable={radiacion}
                setVariable={setRadiacion}
                min={minRadiacion}
                max={maxRadiacion}
                step={stepRadiacion}
                unit='J/cm²'
                sections={[
                  {value: 0.5, color: constants.tramos.blanco, msg: tramosDosisMsg[0]},
                  {value: 1.0, color: constants.tramos.verdeClaro, msg: tramosDosisMsg[1]},
                  {value: 3.0, color: constants.tramos.verde, msg: tramosDosisMsg[2]},
                  {value: 4.5, color: constants.tramos.amarillo, msg: tramosDosisMsg[3]},
                  {value: maxRadiacion, color: constants.tramos.rojo, msg: tramosDosisMsg[4]},
                ]}
                disabled={simulating}
              />

              {/* Distancia aplicador-piel */}
              <RangeColorPicker
                name={t('ULTRAVIOLETAS.DISTANCIA.LABEL')}
                variable={distancia}
                setVariable={setDistancia}
                min={minDistancia}
                max={maxDistancia}
                step={stepDistancia}
                sections={[
                  {value: 2, color: constants.tramos.rojo, msg: tramosDistMsg[0]},
                  {value: 5, color: constants.tramos.verde, msg: tramosDistMsg[1]},
                  {value: 15, color: constants.tramos.verdeClaro, msg: tramosDistMsg[2]},
                  {value: maxDistancia, color: constants.tramos.blanco, msg: tramosDistMsg[3]},
                ]}
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
                infoMsg={t('ULTRAVIOLETAS.IRRADIANCIA_MSG')}
              />

              {/* Tiempo de tratamiento */}
              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
                disabled={true}
                infoMsg={t('ULTRAVIOLETAS.TIEMPO_MSG')}
              />

              {/* Botón de iniciar tratamiento */}
              <LogButton iniciar={iniciarTratamiento} />

              {/****************************************************************/}
              {/* Calculadora */}
              {/****************************************************************/}
              <h2 className='negro'> {t('ULTRAVIOLETAS.CALCULADORA.TITULO')} </h2>

              <ButtonCalculadora/>
              
              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('ULTRAVIOLETAS.MATERIAL')} </h2>
              <IonItem className='gafas-proteccion' lines='full'>
                <p>
                  {t('ULTRAVIOLETAS.GAFAS')} 
                  {tipo == tipo_radiacion.UV_A.value
                    ? ` 365nm`
                    : tipo == tipo_radiacion.UV_B.value
                    ? ` 311nm`
                    : ""
                  }
                </p>
              </IonItem>

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
                    {t(`ULTRAVIOLETAS.ULTRAVIOLETAS`)} 
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

export default UVAprendizaje;