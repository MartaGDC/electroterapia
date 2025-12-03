import './MonofasicaAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Grafica from '../../components/Grafica/Grafica';
import { Trans, useTranslation } from 'react-i18next';
import { anchuras, anchuras_pausa, formasOnda, maxFrecuencia, maxIntensidad, minFrecuencia, minIntensidad, minMaxAnchuras, plotSerie, stepFrecuencia, stepIntensidad, tecnicas, tipos_diadinamica } from '../../classes//Monofasica';
import ListPicker from '../../components/Pickers/ListPicker';
import RangePicker from '../../components/Pickers/RangePicker';
import TimePicker from '../../components/Pickers/TimePicker';
import constants from '../../constants/constants';
import { Simuladores, Time } from '../../constants/interfaces';
import RangeMagnitudesPicker from '../../components/Pickers/RangeMagnitudesPicker';
import { valueOptions } from '../../components/Logica/General';
import MaterialPicker from '../../components/Pickers/MaterialPicker';
import { Electrodo, TipoElectrodo } from '../../classes/Electrodos';
import { useLog } from '../../context/logContext';
import LogButton from '../../components/Logs/LogButton';
import { MaterialCaucho, SizeCauchoAdhesivo } from '../../classes/Materiales';

const MonofasicaAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {simulating, paused, tiempoRestante, iniciar} = useLog();

  const [series, setSeries] = useState<any>([]);
  
  //////////////////////////////////////////////////////////////////////////////
  // Electrodos
  //////////////////////////////////////////////////////////////////////////////
  const [catodo, setCatodo] = useState<Electrodo>(new Electrodo(50, 50, TipoElectrodo.CATODO, "#000000", null));
  const [anodo, setAnodo] = useState<Electrodo>(new Electrodo(50, 50, TipoElectrodo.ANODO, "#ff0000", null));

  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const [anchura, setAnchura] = useState<number>(anchuras[0].min);
  const [magnitudAnchura, setMagnitudAnchura] = useState(anchuras[0].value);

  const [tiempoPausa, setTiempoPausa] = useState(minFrecuencia);
  const [magnitudTiempoPausa, setMagnitudTiempoPausa] = useState(anchuras_pausa[0].value);

  const [frecuencia, setFrecuencia] = useState<number>(minFrecuencia);

  const [formaOnda, setFormaOnda] = useState<any>(null);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  const [intensidad, setIntensidad] = useState(0);
  
  const [tecnica, setTecnica] = useState(tecnicas.M_NULL);
  const [diadinamica, setDiadinamica] = useState(null);
  const [fibras, setFibras] = useState(null);

  // Otros
  const [minAnchura, setMinAnchura] = useState(anchuras[0].min)
  const [maxAnchura, setMaxAnchura] = useState(anchuras[0].max)

  //////////////////////////////////////////////////////////////////////////////
  // Options para list pickers
  //////////////////////////////////////////////////////////////////////////////
  const tecOptions = valueOptions('MONOFASICA.CORRIENTES.OPCIONES', t, tecnicas.values, () => false);
  const formOptions = valueOptions('MONOFASICA.FORMA_ONDA.OPCIONES', t, formasOnda.values, () => false);
  const diadinamicaOptions = valueOptions('MONOFASICA.DIADINAMICA.OPCIONES', t, tipos_diadinamica.values, () => false);

  const anchurasOptions = anchuras.map((el, idx) => (
    { name: anchuras[idx].name, value: anchuras[idx].value, disabled: el.name == "μs" && tecnica != tecnicas.M_NULL }
  ));

  const anchurasPausaOptions = anchuras_pausa.map((el, idx) => (
    { name: anchuras_pausa[idx].name, value: anchuras_pausa[idx].value, disabled: false }
  ));

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {
    setSeries([]);
    setCatodo(new Electrodo(50, 50, TipoElectrodo.CATODO, "#000000", null));
    setAnodo(new Electrodo(50, 50, TipoElectrodo.ANODO, "#ff0000", null));
  
    setAnchura(anchuras[0].min);
    setMagnitudAnchura(anchuras[0].value);
  
    setTiempoPausa(minFrecuencia);
    setMagnitudTiempoPausa(anchuras_pausa[0].value);
  
    setFrecuencia(minFrecuencia);
  
    setFormaOnda(null);
    setTratamiento(new Time(0, 0));
    setIntensidad(0);
    
    setTecnica(tecnicas.M_NULL);
    setDiadinamica(null);
    setFibras(null);
  
    // Otros
    setMinAnchura(anchuras[0].min);
    setMaxAnchura(anchuras[0].max);
  })

  //////////////////////////////////////////////////////////////////////////////
  // Series de la gráfica
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    let time;
    if (tecnica == tecnicas.M_DIADINAMICAS && diadinamica == tipos_diadinamica.LARGO_PERIODO) {
      time = new Time(0, 10);
    } else if (tecnica == tecnicas.M_DIADINAMICAS && diadinamica == tipos_diadinamica.CORTO_PERIODO) {
      time = new Time(0, 2);
    } else {
      time = new Time(0, 1);
    }
    setSeries(
      plotSerie(
        tecnica, diadinamica, time, intensidad, anchura, magnitudAnchura, formaOnda, frecuencia
      )
    );
  }, [tratamiento, intensidad, anchura, formaOnda, frecuencia, magnitudAnchura, magnitudTiempoPausa])

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

  const cambiarTecnica = (tec: any, diad: any = diadinamica, fib: any = fibras) => {
    setTecnica(tec);
    setFibras(null);

    setIntensidad(minIntensidad);

    if (tec == tecnicas.M_NULL) { // Sin corriente específica
      setCatodo((prev: Electrodo) => prev.setToNull());
      setAnodo((prev: Electrodo) => prev.setToNull());
      setAnchura(anchuras[magnitudAnchura].min);
      setFrecuencia(minFrecuencia);
      setFormaOnda(null);
      setIntensidad(0);
      setTratamiento(new Time(0, 0));

    } else if (tec == tecnicas.M_TRABERT) { // TENS (fibras Abeta)
      setCatodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialCaucho(SizeCauchoAdhesivo.INTERMEDIO)));
      setAnodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialCaucho(SizeCauchoAdhesivo.INTERMEDIO)));
      setAnchura(2);
      setMagnitudAnchura(1);
      setMinAnchura(minMaxAnchuras.TRABERT.min);
      setMaxAnchura(minMaxAnchuras.TRABERT.max);
      setMagnitudTiempoPausa(0);
      changeTiempoPausa(7, 0, 2, 1);
      setTratamiento(new Time(20, 0));
      setFormaOnda(formasOnda.F_CUADRANGULAR);
      
    } else if (tec == tecnicas.M_DIADINAMICAS) { // TENS (fibras Adelta)
      setCatodo((prev: Electrodo) => prev.setToNull());
      setAnodo((prev: Electrodo) => prev.setToNull());
      setAnchura(10);
      setMagnitudAnchura(1);
      setMinAnchura(minMaxAnchuras.DIADINAMICA.min);
      setMaxAnchura(minMaxAnchuras.DIADINAMICA.max);
      setTratamiento(new Time(10, 0));
      setFormaOnda(formasOnda.F_SINUSOIDAL);

      if (diad == tipos_diadinamica.DIFASICA_FIJA) {
        changeTiempoPausa(0, 0, 10, 1);
        // changeFrecuencia(100, 10);

      } else if (diad == tipos_diadinamica.MONOFASICA_FIJA) {
        changeTiempoPausa(10, 0, 10, 1);
        // changeFrecuencia(50, 10);
      } else if (diad == tipos_diadinamica.CORTO_PERIODO) {
        changeFrecuencia(50, 10);

      } else if (diad == tipos_diadinamica.LARGO_PERIODO) {

      }
    }
  }

  useEffect(() => {
    changeFrecuencia(minFrecuencia, minAnchura, 0);
  }, [])

  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const iniciarTratamiento = () => {
    if (!catodo.isPrepared() || !anodo.isPrepared()) {
      present({ message: t('MONOFASICA.ALERTAS.ELECTRODOS'), duration: 4000, cssClass: "error-toast" })
    } else if (formaOnda == null) {
      present({ message: t('MONOFASICA.ALERTAS.FORMA_ONDA'), duration: 4000, cssClass: "error-toast" })
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('MONOFASICA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" })
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: {  } },
        Simuladores.MONOFASICA
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
            <IonTitle> Corriente Monofásica </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
            <IonContent>

              <ListPicker
                variable={tecnica}
                onChange={cambiarTecnica}
                label={t('MONOFASICA.CORRIENTES.LABEL')}
                placeholder={t('MONOFASICA.CORRIENTES.PH')}
                valueOptions={tecOptions}
                disabled={simulating}
              />

              {tecnica == tecnicas.M_DIADINAMICAS &&
                <ListPicker
                  variable={diadinamica}
                  onChange={(e: any) => {
                    setDiadinamica(e);
                    cambiarTecnica(tecnica, e);
                  }}
                  label={t('MONOFASICA.DIADINAMICA.LABEL')}
                  placeholder={t('MONOFASICA.DIADINAMICA.PH')}
                  valueOptions={diadinamicaOptions}
                  disabled={simulating}
                />
              }

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('MONOFASICA.PARAMETROS')} </h2>

              <ListPicker
                variable={formaOnda}
                onChange={setFormaOnda}
                label={t('MONOFASICA.FORMA_ONDA.LABEL')}
                placeholder={t('MONOFASICA.FORMA_ONDA.PH')}
                valueOptions={formOptions}
                disabled={simulating && !paused}
              />
              
              {/* Duración de pulso */}
              <RangeMagnitudesPicker
                name={t('MONOFASICA.ANCHURA')}
                variable={anchura}
                setVariable={(e) => {
                  setAnchura(e);
                  changeFrecuencia(frecuencia, e);
                }}
                min={tecnica == tecnicas.M_NULL ? anchuras[magnitudAnchura].min : minAnchura}
                max={tecnica == tecnicas.M_NULL ? anchuras[magnitudAnchura].max : maxAnchura}
                step={anchuras[magnitudAnchura].step}
                magnitude={magnitudAnchura}
                setMagnitude={setMagnitudAnchura}
                valueOptions={anchurasOptions}
                disabled={tecnica == tecnicas.M_DIADINAMICAS}
              />

              {/* Duración de pausa */}
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
              />

              {/* Frecuencia */}
              <RangePicker
                name={t('MONOFASICA.FRECUENCIA')}
                variable={Math.floor(frecuencia)}
                setVariable={changeFrecuencia}
                unit='Hz'
                min={minFrecuencia}
                max={maxFrecuencia}
                step={stepFrecuencia}
                disabled={tecnica == tecnicas.M_DIADINAMICAS 
                  && (diadinamica == tipos_diadinamica.CORTO_PERIODO 
                    || diadinamica == tipos_diadinamica.LARGO_PERIODO)}
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
                infoMsg={tecnica == tecnicas.M_TRABERT ? t('MONOFASICA.INTENSIDAD.TRABERT') : ""}
              />

              {/* Tiempo de Tratamiento */}
              <TimePicker
                variable={tratamiento} 
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
              />

              {/* Iniciar Tratamiento */}
              <LogButton iniciar={iniciarTratamiento} />
              
              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('MONOFASICA.MATERIALES')} </h2>

              {/* Anodo */}
              <MaterialPicker
                electrodo={anodo}
                setElectrodo={setAnodo}
                label1={t('MONOFASICA.ELECTRODOS.ANODO.LABEL')}
                placeholder1={t('MONOFASICA.ELECTRODOS.ANODO.PH')}
                label2={t('MONOFASICA.ELECTRODOS.TAMAÑO.LABEL')}
                placeholder2={t('MONOFASICA.ELECTRODOS.TAMAÑO.PH')}
                caucho
                disabled1={simulating}
                disabled2={simulating}
              />

              {/* Catodo */}
              <MaterialPicker
                electrodo={catodo}
                setElectrodo={setCatodo}
                label1={t('MONOFASICA.ELECTRODOS.CATODO.LABEL')}
                placeholder1={t('MONOFASICA.ELECTRODOS.CATODO.PH')}
                label2={t('MONOFASICA.ELECTRODOS.TAMAÑO.LABEL')}
                placeholder2={t('MONOFASICA.ELECTRODOS.TAMAÑO.PH')}
                caucho
                disabled1={simulating}
                disabled2={simulating}
              />

            </IonContent>
          </IonCol>
          {/* Parte derecha */}
          <IonCol size={constants.dchColAprendizaje} className='derecha ion-no-padding ion-no-margin'>
            <IonContent>
              <IonCard className='explicacion-content ion-no-padding ion-no-margin'>
                <IonCardHeader>
                  <Grafica 
                    series={series} 
                    type={`${formaOnda == formasOnda.F_SINUSOIDAL ? 'monofasicaSinusoidal' : 'monofasica'}`} 
                    doAnimation={simulating}
                    tiempoSim={tratamiento.toSeconds() - tiempoRestante / 1000}
                  />

                  <h1 className='ion-text-center'>
                    {t("GALVANICA.INFORMACION")} 
                  </h1>
                  <h2 className='modo-titulo ion-text-center'> 
                    {t(`MONOFASICA.MONOFASICA`)} 
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

export default MonofasicaAprendizaje;