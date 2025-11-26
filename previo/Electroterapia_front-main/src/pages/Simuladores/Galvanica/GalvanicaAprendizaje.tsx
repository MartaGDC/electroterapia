import './GalvanicaAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Grafica from '../../../components/Grafica/Grafica';
import { Trans, useTranslation } from 'react-i18next';
import { calcularMaximo, exhaustiveSerie, maxIntensidad, minIntensidad, plotSerie, tecnicas } from './Galvanica';
import TimePicker from '../../../components/Pickers/TimePicker';
import ListPicker from '../../../components/Pickers/ListPicker';
import RangeColorPicker from '../../../components/Pickers/RangeColorPicker';
import { PositionsTDCS, Simuladores, Time } from '../../../constants/interfaces';
import constants from '../../../constants/constants';
import { valueOptions } from '../../../components/Logica/General';
import MaterialPicker from '../../../components/Pickers/MaterialPicker';
import { Electrodo, TipoElectrodo } from '../../../classes/Electrodos';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';
import { MaterialAguja, MaterialCaucho, SizeCauchoAdhesivo } from '../../../classes/Materiales';
import ButtonTDCS from '../../../components/tDCS/ButtonTDCS';

const GalvanicaAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const { simulating, tiempoRestante, iniciar } = useLog();

  const [series, setSeries] = useState<any>([]);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  const [rampa, setRampa] = useState<Time>(new Time(0, 0));
  const [intensidad, setIntensidad] = useState(0);
  const [catodo, setCatodo] = useState<Electrodo>(new Electrodo(50, 50, TipoElectrodo.CATODO, "#000000", null));
  const [anodo, setAnodo] = useState<Electrodo>(new Electrodo(50, 50, TipoElectrodo.ANODO, "#ff0000", null));
  const [tecnica, setTecnica] = useState(tecnicas.NULL_TEC);

  const [catodoTDCS, setCatodoTDCS] = useState<PositionsTDCS | null>(null);
  const [anodoTDCS, setAnodoTDCS] = useState<PositionsTDCS | null>(null);

  const [maxDosis, setMaxDosis] = useState<number>(0);

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {
    setSeries([]);
    setTratamiento(new Time(0, 0));
    setRampa(new Time(0, 0));
    setIntensidad(0);
    setCatodo(new Electrodo(50, 50, TipoElectrodo.CATODO, "#000000", null));
    setAnodo(new Electrodo(50, 50, TipoElectrodo.ANODO, "#ff0000", null));
    setTecnica(tecnicas.NULL_TEC);
  
    setCatodoTDCS(null);
    setAnodoTDCS(null);
    setMaxDosis(0);
  
  })

  const indicaciones = t(`GALVANICA.INDICACIONES_LISTA`, { returnObjects: true });
  const contraindicaciones = t(`GALVANICA.CONTRAINDICACIONES_LISTA`, { returnObjects: true });

  // Si `indicaciones` no es un array, asignamos un array vacío para evitar el error.
  const listaIndicaciones = Array.isArray(indicaciones) ? indicaciones : [];
  const listaContraindicaciones = Array.isArray(contraindicaciones) ? contraindicaciones : [];

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para los List Pickers
  //////////////////////////////////////////////////////////////////////////////
  const tecOptions = valueOptions('GALVANICA.TECNICAS.OPCIONES', t, tecnicas.values, () => false);

  //////////////////////////////////////////////////////////////////////////////
  // Lógica del simulador
  //////////////////////////////////////////////////////////////////////////////
  const cambiarTecnica = (tec: any) => {
    if (tec == tecnicas.NULL_TEC) { // Sin técnica específica
      setTecnica(tec);
      setCatodo((prev: Electrodo) => prev.setToNull());
      setAnodo((prev: Electrodo) => prev.setToNull());
      setRampa(new Time(0, 0));
      setTratamiento(new Time(0, 0));
      setIntensidad(0);
    } else if (tec == tecnicas.EPI_ALTA) { // EPI Alta intensidad
      setTecnica(tec);
      setCatodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialCaucho(SizeCauchoAdhesivo.MEDIANO)));
      setAnodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialAguja(null)));
      setRampa(new Time(0, 0));
      setTratamiento(new Time(0, 3));
      setIntensidad(3);
    } else if (tec == tecnicas.EPI_BAJA) { // EPI Baja intensidad
      setTecnica(tec); 
      setCatodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialCaucho(SizeCauchoAdhesivo.MEDIANO)));
      setAnodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialAguja(null)));
      setRampa(new Time(0, 0));
      setTratamiento(new Time(1, 30));
      setIntensidad(0.3);
    } else if (tec == tecnicas.tDCS) { // tDCS
      setTecnica(tec);
      setCatodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialCaucho(SizeCauchoAdhesivo.CIRCULAR)));
      setAnodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialCaucho(SizeCauchoAdhesivo.CIRCULAR)));
      setRampa(new Time(0, 10));
      setTratamiento(new Time(20, 0));
      setIntensidad(2);
    }
  }

  useEffect(() => {
    setSeries(plotSerie(tratamiento, rampa, intensidad, catodo, anodo));
  }, [tratamiento, rampa, intensidad, catodo, anodo]);

  useEffect(() => {
    const newMaxDosis = calcularMaximo(catodo, anodo);
    setMaxDosis(newMaxDosis);
  }, [catodo, anodo]);

  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const iniciarTratamiento = () => {
    if (!catodo.isPrepared() || !anodo.isPrepared()) {
      present({ message: t('GALVANICA.ALERTAS.ELECTRODOS'), duration: 4000, cssClass: "error-toast" })
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('GALVANICA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" })
    } else if (tratamiento.toSeconds() < rampa.toSeconds()) {
      present({ message: t('GALVANICA.ALERTAS.RAMPA'), duration: 4000, cssClass: "error-toast" })
    } else {
      const plot = exhaustiveSerie(tratamiento, rampa, intensidad, catodo, anodo);
      setSeries(plot);
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento, rampa, catodo, anodo },
        { time: Date.now(), params: {  } },
        Simuladores.GALVANICA
      )
    }
  };

  
  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={constants.aprendizajeIcon}/>
            <IonTitle> {t("GALVANICA.GALVANICA.0")} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
            <IonContent>

              {/* Tecnica */}
              <ListPicker
                variable={tecnica}
                onChange={cambiarTecnica}
                label={t('GALVANICA.TECNICAS.LABEL')}
                placeholder={t('GALVANICA.TECNICAS.PH')}
                valueOptions={tecOptions}
                disabled={simulating}
              />

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('GALVANICA.PARAMETROS')} </h2>
              
              {/* Intensidad */}
              <RangeColorPicker
                name={t('GALVANICA.INTENSIDAD')}
                variable={intensidad}
                setVariable={setIntensidad}
                disabled={tecnica != tecnicas.NULL_TEC}
                min={minIntensidad}
                max={maxIntensidad}
                step={0.1}
                sections={[
                  { value: maxDosis, color: "", msg: `${t('GALVANICA.DOSIS_MAXIMA')}: ${maxDosis} mA` },
                  { value: maxIntensidad, color: constants.tramos.rojo, msg: `${t('GALVANICA.RIESGO_QUEMADURA')}` }
                ]}
                unit='mA'
              />

              {/* Tiempo de Tratamiento */}
              <TimePicker
                variable={tratamiento} 
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
                disabled={tecnica != tecnicas.NULL_TEC}
              />

              {/* Tiempo de Rampa */}
              <TimePicker
                variable={rampa} 
                setVariable={setRampa}
                doAnimation={simulating}
                tiempoRestante={
                  rampa.toSeconds() * 1000 - (tratamiento.toSeconds() * 1000 - tiempoRestante) >= 0 
                  ? new Time(0, 0, rampa.toSeconds() * 1000 - (tratamiento.toSeconds() * 1000 - tiempoRestante))
                  : new Time(0, 0)
                }
                disabled={tecnica != tecnicas.NULL_TEC}
                labelText='Tiempo de rampa'
              />
    
              {/* Iniciar Tratamiento */}
              <LogButton iniciar={iniciarTratamiento} />

              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('GALVANICA.MATERIALES')} </h2>
              
              {/* Anodo */}
              <MaterialPicker
                electrodo={anodo}
                setElectrodo={setAnodo}
                label1={t('GALVANICA.ELECTRODOS.ANODO.LABEL')}
                placeholder1={t('GALVANICA.ELECTRODOS.ANODO.PH')}
                label2={t('GALVANICA.ELECTRODOS.TAMAÑO.LABEL')}
                placeholder2={t('GALVANICA.ELECTRODOS.TAMAÑO.PH')}
                aguja
                caucho
              />

              {/* Catodo */}
              <MaterialPicker
                electrodo={catodo}
                setElectrodo={setCatodo}
                label1={t('GALVANICA.ELECTRODOS.CATODO.LABEL')}
                placeholder1={t('GALVANICA.ELECTRODOS.CATODO.PH')}
                label2={t('GALVANICA.ELECTRODOS.TAMAÑO.LABEL')}
                placeholder2={t('GALVANICA.ELECTRODOS.TAMAÑO.PH')}
                aguja
                caucho
              />

              {tecnica == tecnicas.tDCS &&
                <ButtonTDCS
                  modo="aprendizaje"
                  anodoTDCS={anodoTDCS}
                  catodoTDCS={catodoTDCS}
                  setAnodoTDCS={setAnodoTDCS}
                  setCatodoTDCS={setCatodoTDCS}
                />
              }
            </IonContent>
          </IonCol>
          {/* Parte derecha */}
          <IonCol size={constants.dchColAprendizaje} className='derecha ion-no-padding ion-no-margin' style={{height: "100%"}}>
            <IonContent>
              <IonCard className='explicacion-content ion-no-padding ion-no-margin'>
                <IonCardHeader>
                  <Grafica 
                    series={series} 
                    type={"galvanica"} 
                    doAnimation={simulating} 
                    tiempoSim={tratamiento.toSeconds() - tiempoRestante / 1000}
                  />

                  <h1 className='ion-text-center'>
                    {t("GALVANICA.INFORMACION")} 
                  </h1>
                  <h2 className='modo-titulo ion-text-center'> 
                    {t(`GALVANICA.GALVANICA.${tecnica}`)} 
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

export default GalvanicaAprendizaje;