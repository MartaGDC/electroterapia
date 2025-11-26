import './BifasicaAprendizaje.css'

import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonMenuButton, IonPage, IonPickerLegacy, IonRange, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToast, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Grafica from '../../../components/Grafica/Grafica';
import { pulseOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { calculateMaxAnchuraTren, formasOnda, maxAnchura, maxFrecuencia, maxFrecuenciaTrenes, maxIntensidad, minAnchura, minFrecuencia, minFrecuenciaTrenes, minIntensidad, plotSerie, stepAnchura, stepFrecuencia, stepFrecuenciaTrenes, stepIntensidad, tecnicas, tipos_fibras } from './Bifasica';
import { minMax, msgArray, valueOptions } from '../../../components/Logica/General';
import TimePicker from '../../../components/Pickers/TimePicker';
import ListPicker from '../../../components/Pickers/ListPicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import constants from '../../../constants/constants';
import DoubleListPicker from '../../../components/Pickers/DoubleListPicker';
import { Simuladores, Time, Tramo } from '../../../constants/interfaces';
import { Electrodo, TipoElectrodo } from '../../../classes/Electrodos';
import MaterialPicker from '../../../components/Pickers/MaterialPicker';
import RangeColorPicker from '../../../components/Pickers/RangeColorPicker';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';
import { MaterialAdhesivo, MaterialAguja } from '../../../classes/Materiales';

const BifasicaAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {simulating, paused, tiempoRestante, iniciar} = useLog();

  const [series, setSeries] = useState<any>([]);
  
  //////////////////////////////////////////////////////////////////////////////
  // Electrodos
  //////////////////////////////////////////////////////////////////////////////
  const [catodo, setCatodo] = useState<Electrodo>(
    new Electrodo(50, 50, TipoElectrodo.CATODO, "#000000", null)
  );
  const [anodo, setAnodo] = useState<Electrodo>(
    new Electrodo(50, 50, TipoElectrodo.ANODO, "#ff0000", null)
  );

  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const [fibras, setFibras] = useState<any>(null);
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
  const [tecnica, setTecnica] = useState(tecnicas.B_NULL);
  
  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const tecOptions = valueOptions('BIFASICA.CORRIENTES.OPCIONES', t, tecnicas.values, () => false);
  const formOptions = valueOptions('BIFASICA.FORMA_ONDA.OPCIONES', t, formasOnda.values, () => false);
  const fibrasOptions = valueOptions('BIFASICA.FIBRAS.OPCIONES', t, tipos_fibras.values, () => false);

  //////////////////////////////////////////////////////////////////////////////
  // Mensajes de información (array de strings)
  //////////////////////////////////////////////////////////////////////////////
  const anchuraEENMmsg = msgArray('BIFASICA.ANCHURA_EENM_MSG', t);
  const frecuenciaEENMmsg = msgArray('BIFASICA.FRECUENCIA_EENM_MSG', t);

  //////////////////////////////////////////////////////////////////////////////
  // Secciones para RangeColorPicker
  //////////////////////////////////////////////////////////////////////////////
  const [sectionsAnchura, setSectionsAnchura] = useState<Tramo[]>([]);
  const [sectionsFrecuencia, setSectionsFrecuencia] = useState<Tramo[]>([]);

  // Tens Convencional (fibras Abeta)
  const sectionsAnchuraAbeta: Tramo[] = [
    {value: 49, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
    {value: 80, color: constants.tramos.verde, msg: t('BIFASICA.RANGO_RECOMENDADO')},
    {value: maxAnchura, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
  ];
  const sectionsFrecuenciaAbeta: Tramo[] = [
    {value: 109, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
    {value: 120, color: constants.tramos.verde, msg: t('BIFASICA.RANGO_RECOMENDADO')},
    {value: maxFrecuencia, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
  ];

  // Tens Convencional (fibras Adelta)
  const sectionsAnchuraAdelta: Tramo[] = [
    {value: 149, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
    {value: 150, color: constants.tramos.verde, msg: t('BIFASICA.RANGO_RECOMENDADO')},
    {value: maxAnchura, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
  ];
  const sectionsFrecuenciaAdelta: Tramo[] = [
    {value: 79, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
    {value: 80, color: constants.tramos.verde, msg: t('BIFASICA.RANGO_RECOMENDADO')},
    {value: maxFrecuencia, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
  ];

  // Tens de acupuntura
  const sectionsAnchuraAcupuntura: Tramo[] = [
    {value: 149, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
    {value: 250, color: constants.tramos.verde, msg: t('BIFASICA.RANGO_RECOMENDADO')},
    {value: maxAnchura, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
  ];
  const sectionsFrecuenciaAcupuntura: Tramo[] = [
    {value: 0, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
    {value: 4, color: constants.tramos.verde, msg: t('BIFASICA.RANGO_RECOMENDADO')},
    {value: maxFrecuencia, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
  ];

  // Tens trenes
  const sectionsAnchuraTrenes: Tramo[] = [
    {value: 149, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
    {value: 250, color: constants.tramos.verde, msg: t('BIFASICA.RANGO_RECOMENDADO')},
    {value: maxAnchura, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
  ];
  const sectionsFrecuenciaTrenes: Tramo[] = [
    {value: 99, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
    {value: 100, color: constants.tramos.verde, msg: t('BIFASICA.RANGO_RECOMENDADO')},
    {value: maxFrecuencia, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
  ];

  // EENM
  const sectionsAnchuraEENM: Tramo[] = [
    {value: 199, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
    {value: 400, color: constants.tramos.verde, msg: t('BIFASICA.RANGO_RECOMENDADO')},
    {value: maxAnchura, color: constants.tramos.rojo, msg: t('BIFASICA.RANGO_NO_RECOMENDADO')},
  ];
  const sectionsFrecuenciaEENM: Tramo[] = [
    {value: 1, color: "", msg: t('BIFASICA.RANGO_FIBRAS.TONOLITICO')},
    {value: 3, color: "", msg: t('BIFASICA.RANGO_FIBRAS.RELAJACION')},
    {value: 6, color: "", msg: t('BIFASICA.RANGO_FIBRAS.CONTRACCION')},
    {value: 7, color: "", msg: ""},
    {value: 10, color: "", msg: t('BIFASICA.RANGO_FIBRAS.VIBRACION')},
    {value: 19, color: "", msg: ""},
    {value: 40, color: "", msg: t('BIFASICA.RANGO_FIBRAS.TIPO_I')},
    {value: 70, color: "", msg: t('BIFASICA.RANGO_FIBRAS.TIPO_IIa')},
    {value: 90, color: "", msg: t('BIFASICA.RANGO_FIBRAS.TIPO_IIb')},
    {value: 100, color: "", msg: ""},
    {value: maxFrecuencia, color: "", msg: t('BIFASICA.RANGO_FIBRAS.ANALGESIA')},
  ];

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {
    setSeries([]);
    setCatodo(new Electrodo(50, 50, TipoElectrodo.CATODO, "#000000", null));
    setAnodo(new Electrodo(50, 50, TipoElectrodo.ANODO, "#ff0000", null));
    setFibras(null);
    setAnchura(minAnchura);
    setFrecuencia(minFrecuencia);
    setFrecuenciaTren(2);
    setAnchuraTren(0); // ms
    setMaxAnchuraTren(0);
    setFormaOnda(null);
    setTratamiento(new Time(0, 0));
    setIntensidad(0);
    setTecnica(tecnicas.B_NULL);
    setSectionsAnchura([]);
    setSectionsFrecuencia([]);
  });

  //////////////////////////////////////////////////////////////////////////////
  // Técnicas
  //////////////////////////////////////////////////////////////////////////////
  const cambiarTecnica = (tec: any) => {
    setTecnica(tec);
    setIntensidad(minIntensidad);

    if (tec == tecnicas.B_NULL) { // Sin corriente específica
      setCatodo((prev: Electrodo) => prev.setToNull());
      setAnodo((prev: Electrodo) => prev.setToNull());
      setAnchura(0);
      setFormaOnda(null);
      setIntensidad(0);
      setTratamiento(new Time(0, 0));
      setSectionsAnchura([]);
      setSectionsFrecuencia([]);

    } else if (tec == tecnicas.B_TENS_CONVENCIONAL) {
      setCatodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialAdhesivo(null)));
      setAnodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialAdhesivo(null)));
      setTratamiento(new Time(60, 0));
      setFormaOnda(formasOnda.ASIMETRICA);

      if (fibras == tipos_fibras.ABETA) {
        // TENS (fibras Abeta)
        setAnchura(60);
        setFrecuencia(115);
        setSectionsAnchura(sectionsAnchuraAbeta);
        setSectionsFrecuencia(sectionsFrecuenciaAbeta);
    
      } else if (fibras == tipos_fibras.ADELTA) {
        // TENS (fibras Adelta)
        setAnchura(150);
        setFrecuencia(80);
        setSectionsAnchura(sectionsAnchuraAdelta);
        setSectionsFrecuencia(sectionsFrecuenciaAdelta);

      }
    } else if (tec == tecnicas.B_TENS_ACUPUNTURA) { // TENS de acupuntura
      setCatodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialAguja(null)));
      setAnodo((prev: Electrodo) => prev.changeMaterialAndSize(new MaterialAguja(null)));
      setAnchura(200);
      setFrecuencia(1);
      setTratamiento(new Time(30, 0));
      setFormaOnda(formasOnda.ASIMETRICA);
      setSectionsAnchura(sectionsAnchuraAcupuntura);
      setSectionsFrecuencia(sectionsFrecuenciaAcupuntura);  
  
    } else if (tec == tecnicas.B_TENS_TRENES) { // TENS por trenes de impulsos
      setCatodo((prev: Electrodo) => prev.setToNull());
      setAnodo((prev: Electrodo) => prev.setToNull());
      setAnchura(200);
      setFrecuencia(100);
      setFormaOnda(formasOnda.ASIMETRICA);
      setSectionsAnchura(sectionsAnchuraTrenes);
      setSectionsFrecuencia(sectionsFrecuenciaTrenes);
  
    } else if (tec == tecnicas.B_EENM) { // EENM
      setCatodo((prev: Electrodo) => prev.setToNull());
      setAnodo((prev: Electrodo) => prev.setToNull());
      setAnchura(200);
      setFrecuencia(30);
      setFormaOnda(formasOnda.SIMETRICA);
      setSectionsAnchura(sectionsAnchuraEENM);
      setSectionsFrecuencia(sectionsFrecuenciaEENM);

    }
  }

  useEffect(() => {
    cambiarTecnica(tecnica);
  }, [fibras])

  // Series para la gráfica
  useEffect(() => {
    setSeries(plotSerie(new Time(0, 1), intensidad, anchura, formaOnda, frecuencia, tecnica, anchuraTren, frecuenciaTren));
  }, [tratamiento, intensidad, anchura, formaOnda, frecuencia, tecnica, anchuraTren, frecuenciaTren])
  
  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const iniciarTratamiento = () => {
    if (catodo == null || anodo == null) {
      present({ message: t('BIFASICA.ALERTAS.ELECTRODOS'), duration: 4000, cssClass: "error-toast" });
    } else if (formaOnda == null) {
      present({ message: t('BIFASICA.ALERTAS.FORMA_ONDA'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('BIFASICA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else if (intensidad == 0) {
      present({ message: t('BIFASICA.ALERTAS.INTENSIDAD'), duration: 4000, cssClass: "error-toast" })
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: { intensidad, frecuencia, anchura } },
        Simuladores.BIFASICA
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
            <IonTitle> Corriente Bifásica </IonTitle>
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

              {/* Tecnica */}
              <ListPicker
                variable={tecnica}
                onChange={cambiarTecnica}
                label={t('BIFASICA.CORRIENTES.LABEL')}
                placeholder={t('BIFASICA.CORRIENTES.PH')}
                valueOptions={tecOptions}
                disabled={simulating}
              />

              {/* Fibras */}
              {tecnica == tecnicas.B_TENS_CONVENCIONAL &&
                <ListPicker
                  variable={fibras}
                  onChange={setFibras}
                  label={t('BIFASICA.FIBRAS.LABEL')}
                  placeholder={t('BIFASICA.FIBRAS.PH')}
                  valueOptions={fibrasOptions}
                  disabled={simulating && !paused}
                />
              }

              {/* Forma de onda */}
              <ListPicker
                variable={formaOnda}
                onChange={setFormaOnda}
                label={t('BIFASICA.FORMA_ONDA.LABEL')}
                placeholder={t('BIFASICA.FORMA_ONDA.PH')}
                valueOptions={formOptions}
                disabled={simulating && !paused}
              />

              {tecnica == tecnicas.B_NULL || 
              (tecnica == tecnicas.B_TENS_CONVENCIONAL && fibras == null) ? (
                <>
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
                </>
              ) : (
                <>
                  {/* Anchura de pulso */}
                  <RangeColorPicker
                    name={t('BIFASICA.ANCHURA')}
                    variable={anchura}
                    setVariable={setAnchura}
                    min={minAnchura}
                    max={maxAnchura}
                    step={stepAnchura}
                    unit='µs'
                    sections={sectionsAnchura}
                    infoMsg={tecnica == tecnicas.B_EENM ? anchuraEENMmsg : undefined}
                  />
                  {/* Frecuencia */}
                  <RangeColorPicker
                    name={t('BIFASICA.FRECUENCIA')}
                    variable={frecuencia}
                    setVariable={setFrecuencia}
                    min={minFrecuencia}
                    max={maxFrecuencia}
                    step={stepFrecuencia}
                    unit='Hz'
                    sections={sectionsFrecuencia}
                    infoMsg={tecnica == tecnicas.B_EENM ? frecuenciaEENMmsg : undefined}
                  />
                </>
              )}


              {tecnica == tecnicas.B_TENS_TRENES &&
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
                    infoMsg={t('BIFASICA.FRECUENCIA_TRENES_MSG')}
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

              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('BIFASICA.MATERIALES')} </h2>

              {/* Anodo */}
              <MaterialPicker
                electrodo={anodo}
                setElectrodo={setAnodo}
                label1={t('BIFASICA.ELECTRODOS.ANODO.LABEL')}
                placeholder1={t('BIFASICA.ELECTRODOS.ANODO.PH')}
                label2={t('BIFASICA.ELECTRODOS.TAMAÑO.LABEL')}
                placeholder2={t('BIFASICA.ELECTRODOS.TAMAÑO.PH')}
                aguja
                adhesivo
                caucho
              />

              {/* Catodo */}
              <MaterialPicker
                electrodo={catodo}
                setElectrodo={setCatodo}
                label1={t('BIFASICA.ELECTRODOS.CATODO.LABEL')}
                placeholder1={t('BIFASICA.ELECTRODOS.CATODO.PH')}
                label2={t('BIFASICA.ELECTRODOS.TAMAÑO.LABEL')}
                placeholder2={t('BIFASICA.ELECTRODOS.TAMAÑO.PH')}
                aguja
                adhesivo
                caucho
              />
            </IonContent>
          </IonCol>
          {/* Parte derecha */}
          <IonCol size={constants.dchColAprendizaje} className='derecha ion-no-padding ion-no-margin'>
            <IonContent>
              <IonCard className='explicacion-content ion-no-padding ion-no-margin'>
                <IonCardHeader>
                  {series &&
                    <Grafica series={series} type={"bifasica"} />
                  }

                  <h1 className='ion-text-center'>
                    {t("GALVANICA.INFORMACION")} 
                  </h1>
                  <h2 className='modo-titulo ion-text-center'> 
                    {t(`GALVANICA.GALVANICA.${tecnica}`)} 
                  </h2>
                </IonCardHeader>
                <IonCardContent>  
                  <IonText className='ion-no-margin ion-no-padding'>
                    <h3 className='ion-margin-start'>
                      {t("GALVANICA.CONCEPTO")}
                    </h3>
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

export default BifasicaAprendizaje;