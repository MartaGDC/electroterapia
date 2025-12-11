import './MediaFrecuenciaSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { contornos, contornos_personalizado, maxBarrido, maxFrecuenciaMA, maxFrecuenciaPortadora, maxIntensidad, minBarrido, minFrecuenciaMA, minFrecuenciaPortadora, minIntensidad, modos_aplicacion, stepFrecuenciaMA, stepFrecuenciaPortadora, stepIntensidad, vectores } from '../../classes/MediaFrecuencia';
import { valueOptions } from '../../components/Logica/General';
import TimePicker from '../../components/Pickers/TimePicker';
import ListPicker from '../../components/Pickers/ListPicker';
import RangePicker from '../../components/Pickers/RangePicker';
import BarridoPicker from '../../components/Pickers/BarridoPicker';
import constants from '../../constants/constants';
import { Simuladores, Time } from '../../constants/interfaces';
import { useLog } from '../../context/logContext';
import LogButton from '../../components/Logs/LogButton';
import TogglePicker from '../../components/Pickers/TogglePicker';
import ImageMapper from '../../components/ImageMapper/ImageMapper';

import icon_1_1 from '../../assets/1-1.svg'
import icon_1_5_1_5 from '../../assets/1-5-1-5.svg'
import icon_1_30_1_30 from '../../assets/1-30-1-30.svg'
import icon_6_6 from '../../assets/6-6.svg'
import icon_12_12 from '../../assets/12-12.svg'

const MediaFrecuenciaSimulacion: React.FC<{
  type: "simulacion" | "evaluacion"
}> = ({
  type
}) => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar, pausar, reanudar, finalizar, 
    agregarParams, reset
  } = useLog();

  //////////////////////////////////////////////////////////////////////////////
  // Tiempos
  //////////////////////////////////////////////////////////////////////////////
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  const [subida, setSubida] = useState<Time>(new Time(0, 0));
  const [mantenimientoMinimo, setMantenimientoMinimo] = useState<Time>(new Time(0, 0));
  const [mantenimientoMaximo, setMantenimientoMaximo] = useState<Time>(new Time(0, 0));
  const [bajada, setBajada] = useState<Time>(new Time(0, 0));
  const [ciclo, setCiclo] = useState<Time>(new Time(0, 0));
  const [aceleracion, setAceleracion] = useState<Time>(new Time(0, 0));
  const [desaceleracion, setDesaceleracion] = useState<Time>(new Time(0, 0));
  const [minimo, setMinimo] = useState<Time>(new Time(0, 0));
  const [maximo, setMaximo] = useState<Time>(new Time(0, 0));

  //////////////////////////////////////////////////////////////////////////////
  // Variables
  //////////////////////////////////////////////////////////////////////////////
  const [modo, setModo] = useState(null);
  const [frecuenciaPortadora, setFrecuenciaPortadora] = useState<number>(minFrecuenciaPortadora);
  const [frecuenciaPortadora2, setFrecuenciaPortadora2] = useState<number>(minFrecuenciaPortadora);
  const [frecuenciaMA, setFrecuenciaMA] = useState(minFrecuenciaMA);
  const [showBarrido, setShowBarrido] = useState<boolean>(false);
  const [barrido, setBarrido] = useState({lower: minFrecuenciaMA, upper: maxFrecuenciaMA});
  const [contorno, setContorno] = useState(contornos.NULL);
  const [contornoPersonalizado, setContornoPersonalizado] = useState(contornos_personalizado.NULL);
  const [vector, setVector] = useState(null);
  const [intensidad, setIntensidad] = useState(0);

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {

    setTratamiento(new Time(0, 0));
    setSubida(new Time(0, 0));
    setMantenimientoMinimo(new Time(0, 0));
    setMantenimientoMaximo(new Time(0, 0));
    setBajada(new Time(0, 0));
    setCiclo(new Time(0, 0));
    setAceleracion(new Time(0, 0));
    setDesaceleracion(new Time(0, 0));
    setMinimo(new Time(0, 0));
    setMaximo(new Time(0, 0));
  
    setModo(null);
    setFrecuenciaPortadora(minFrecuenciaPortadora);
    setFrecuenciaPortadora2(minFrecuenciaPortadora);
    setFrecuenciaMA(minFrecuenciaMA);
    setShowBarrido(false);
    setBarrido({lower: minFrecuenciaMA, upper: maxFrecuenciaMA});
    setContorno(contornos.NULL);
    setContornoPersonalizado(contornos_personalizado.NULL);
    setVector(null);
    setIntensidad(0);
  
    reset();
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones
  //////////////////////////////////////////////////////////////////////////////
  const modoOptions = valueOptions('MEDIA_FRECUENCIA.MODO.OPCIONES', t, modos_aplicacion.values, () => false);
  const contPersOptions = valueOptions('MEDIA_FRECUENCIA.CONTORNOS_PERSONALIZADO.OPCIONES', t, contornos_personalizado.values, () => false);
  const contOptions = valueOptions('MEDIA_FRECUENCIA.CONTORNOS.OPCIONES', t, contornos.values, () => false);
  const vecOptions = valueOptions('MEDIA_FRECUENCIA.VECTOR.OPCIONES', t, vectores.values, () => false);  

  //////////////////////////////////////////////////////////////////////////////
  // Cambiar frecuencias
  //////////////////////////////////////////////////////////////////////////////
  const lastFrecChanged = useRef<null | 1 | 2>(null);
  useEffect(() => {
    if (modo == modos_aplicacion.M_TETRAPOLAR) {
      if (lastFrecChanged.current == 1) {
        const diff = frecuenciaPortadora - frecuenciaPortadora2;
        let newFrec2 = frecuenciaPortadora2;

        if (diff > 100) newFrec2 = frecuenciaPortadora - 100;
        else if (diff < -100) newFrec2 = frecuenciaPortadora + 100;
        
        setFrecuenciaPortadora2(newFrec2);
        setFrecuenciaMA(Math.abs(frecuenciaPortadora - newFrec2));
        lastFrecChanged.current = null;
      } else if (lastFrecChanged.current == 2) {
        const diff = frecuenciaPortadora2 - frecuenciaPortadora;
        let newFrec = frecuenciaPortadora;

        if (diff > 100) newFrec = frecuenciaPortadora2 - 100;
        else if (diff < -100) newFrec = frecuenciaPortadora2 + 100;

        setFrecuenciaPortadora(newFrec);
        setFrecuenciaMA(Math.abs(frecuenciaPortadora2 - newFrec));
        lastFrecChanged.current = null;
      }
    }
  }, [frecuenciaPortadora, frecuenciaPortadora2, modo])
  
  useEffect(() => {
    if (frecuenciaMA > maxFrecuenciaMA) setFrecuenciaMA(maxFrecuenciaMA);
  }, [frecuenciaMA])

  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return {
      modo,
      intensidad,
      frecuenciaPortadora,
      ...(modo == modos_aplicacion.M_TETRAPOLAR 
        ? {
            frecuenciaPortadora2, 
            vector
          } 
        : {}
      ),
      frecuenciaMA,
      ...(showBarrido
        ? { 
            barrido,
            ...(contorno != contornos.NULL
              ? {
                  contorno,
                  ...(contornoPersonalizado != contornos_personalizado.NULL
                    ? {
                        contornoPersonalizado
                      }
                    : {}
                  )
                }
              : {}
            )
          } 
        : {}
      ),
    };
  };

  const iniciarTratamiento = () => {
    if (modo == null) {
      present({ message: t('MEDIA_FRECUENCIA.ALERTAS.MODO'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('MEDIA_FRECUENCIA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: params() },
        Simuladores.MEDIAFRECUENCIA
      )
    }
  }

  useEffect(() => {
    if (modo == modos_aplicacion.M_TETRAPOLAR && Math.abs(frecuenciaPortadora - frecuenciaPortadora2) > 100) return;
    if (frecuenciaMA > maxFrecuenciaMA) setFrecuenciaMA(maxFrecuenciaMA);
    agregarParams({time: Date.now(), params: params()})
  }, [
    intensidad, frecuenciaPortadora, modo, frecuenciaPortadora2, vector, 
    frecuenciaMA, showBarrido, barrido, contorno, contornoPersonalizado
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
            <IonTitle> {t('MEDIA_FRECUENCIA.MEDIA_FRECUENCIA')} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
            <IonContent>
              {/* Modo de aplicación */}
              <ListPicker
                variable={modo}
                onChange={(e:any) => {
                  setModo(e);
                  lastFrecChanged.current = null;
                }}
                label={t('MEDIA_FRECUENCIA.MODO.LABEL')}
                placeholder={t('MEDIA_FRECUENCIA.MODO.PH')}
                valueOptions={modoOptions}
                disabled={simulating}
              />

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('MEDIA_FRECUENCIA.PARAMETROS')} </h2>

              {/* Frecuencia Portadora */}
              <RangePicker
                name={`${t('MEDIA_FRECUENCIA.FRECUENCIA')} ${(modo == modos_aplicacion.M_TETRAPOLAR) ? "1" : ""}`}
                variable={frecuenciaPortadora}
                setVariable={(e) => {
                  setFrecuenciaPortadora(e);
                  lastFrecChanged.current = 1;
                }}
                min={minFrecuenciaPortadora}
                max={maxFrecuenciaPortadora}
                step={stepFrecuenciaPortadora}
                unit='Hz'
              />

              {/* Frecuencia Portadora 2 */}
              {(modo == modos_aplicacion.M_TETRAPOLAR) &&
                <RangePicker
                  name={t('MEDIA_FRECUENCIA.FRECUENCIA') + " 2"}
                  variable={frecuenciaPortadora2}
                  setVariable={(e) => {
                    setFrecuenciaPortadora2(e);
                    lastFrecChanged.current = 2;
                  }}
                  min={minFrecuenciaPortadora}
                  max={maxFrecuenciaPortadora}
                  step={1}
                  unit='Hz'
                />              
              }
            
              {/* Frecuencia Modulada en Amplitud (FMA) */}
              <RangePicker
                name={t('MEDIA_FRECUENCIA.FMA')}
                variable={frecuenciaMA}
                setVariable={setFrecuenciaMA}
                min={minFrecuenciaMA}
                max={maxBarrido}
                step={stepFrecuenciaMA}
                disabled={modo == modos_aplicacion.M_TETRAPOLAR}
                unit='Hz'
              />

              <TogglePicker
                name={t('MEDIA_FRECUENCIA.BARRIDO')}
                variable={showBarrido}
                onChange={() => setShowBarrido(!showBarrido)}
                disabled={simulating && !paused}
              />

              {showBarrido &&
                <>
                  {/* Barrido */}
                  <BarridoPicker
                    name={t('MEDIA_FRECUENCIA.BARRIDO')}
                    variable={barrido}
                    setVariable={setBarrido}
                    midValue={frecuenciaMA}
                    min={minBarrido}
                    max={maxBarrido}
                    step={stepFrecuenciaMA}
                    disabled={simulating && !paused}
                  />

                  <div style={{display: "flex"}}>
                    <ListPicker
                      variable={contorno}
                      onChange={setContorno}
                      label={t('MEDIA_FRECUENCIA.CONTORNOS.LABEL')}
                      placeholder={t('MEDIA_FRECUENCIA.CONTORNOS.PH')}
                      valueOptions={contOptions}
                      disabled={simulating && !paused}
                    />
                    {contorno == contornos.C_1_1 && <IonIcon className='icono-contorno' src={icon_1_1} />}
                    {contorno == contornos.C_6_6 && <IonIcon className='icono-contorno' src={icon_6_6} />}
                    {contorno == contornos.C_1_30_1_30 && <IonIcon className='icono-contorno' src={icon_1_30_1_30} />}
                    {contorno == contornos.C_1_5_1_5 && <IonIcon className='icono-contorno' src={icon_1_5_1_5} />}
                    {contorno == contornos.C_12_12 && <IonIcon className='icono-contorno' src={icon_12_12} />}
                  </div>
                  
                  {contorno == contornos.PERSONALIZADO &&
                    <>
                      <ListPicker
                        variable={contornoPersonalizado}
                        onChange={setContornoPersonalizado}
                        label={t('MEDIA_FRECUENCIA.CONTORNOS_PERSONALIZADO.LABEL')}
                        placeholder={t('MEDIA_FRECUENCIA.CONTORNOS_PERSONALIZADO.PH')}
                        valueOptions={contPersOptions}
                        disabled={simulating && !paused}
                      />

                      {/* Tiempos */}
                      {contornoPersonalizado == contornos_personalizado.TRIANGULAR ? (
                        <>
                          <TimePicker
                            variable={subida}
                            setVariable={setSubida}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.SUBIDA')}
                            disabled={simulating && !paused}
                          />
                          <TimePicker
                            variable={bajada}
                            setVariable={setBajada}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.BAJADA')}
                            disabled={simulating && !paused}
                          />
                        </>
                      ) : contornoPersonalizado == contornos_personalizado.TRAPEZOIDAL ? (
                        <>
                          <TimePicker
                            variable={mantenimientoMinimo}
                            setVariable={setMantenimientoMinimo}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.MANTENIMIENTO_MIN')}
                            disabled={simulating && !paused}
                          />
                          <TimePicker
                            variable={subida}
                            setVariable={setSubida}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.SUBIDA')}
                            disabled={simulating && !paused}
                          />
                          <TimePicker
                            variable={mantenimientoMaximo}
                            setVariable={setMantenimientoMaximo}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.MANTENIMIENTO_MAX')}
                            disabled={simulating && !paused}
                          />
                          <TimePicker
                            variable={bajada}
                            setVariable={setBajada}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.BAJADA')}
                            disabled={simulating && !paused}
                          />
                        </>
                      ) : contornoPersonalizado == contornos_personalizado.SINUSOIDAL ? (
                        <TimePicker
                          variable={ciclo}
                          setVariable={setCiclo}
                          doAnimation={false}
                          labelText={t('MEDIA_FRECUENCIA.CICLO')}
                          disabled={simulating && !paused}
                        />
                      ) : contornoPersonalizado == contornos_personalizado.CUADRADA ? (
                        <>
                          <TimePicker
                            variable={mantenimientoMinimo}
                            setVariable={setMantenimientoMinimo}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.MANTENIMIENTO_MIN')}
                            disabled={simulating && !paused}
                          />
                          <TimePicker
                            variable={mantenimientoMaximo}
                            setVariable={setMantenimientoMaximo}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.MANTENIMIENTO_MAX')}
                            disabled={simulating && !paused}
                          />
                        </>
                      ) : contornoPersonalizado == contornos_personalizado.EXPONENCIAL ? (
                        <>
                          <TimePicker
                            variable={aceleracion}
                            setVariable={setAceleracion}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.ACELERACION')}
                            disabled={simulating && !paused}
                          />
                          <TimePicker
                            variable={desaceleracion}
                            setVariable={setDesaceleracion}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.DESACELERACION')}
                            disabled={simulating && !paused}
                          />
                        </>
                      ) : contornoPersonalizado == contornos_personalizado.ALEATORIA ? (
                        <>
                          <TimePicker
                            variable={minimo}
                            setVariable={setMinimo}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.MINIMO')}
                            disabled={simulating && !paused}
                          />
                          <TimePicker
                            variable={maximo}
                            setVariable={setMaximo}
                            doAnimation={false}
                            labelText={t('MEDIA_FRECUENCIA.MAXIMO')}
                            disabled={simulating && !paused}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  }
                </>
              }

              {modo == modos_aplicacion.M_TETRAPOLAR &&
                <ListPicker
                  variable={vector}
                  onChange={setVector}
                  label={t('MEDIA_FRECUENCIA.VECTOR.LABEL')} 
                  placeholder={t('MEDIA_FRECUENCIA.VECTOR.PH')} 
                  valueOptions={vecOptions}
                />
              }

              {/* Intensidad */}
              <RangePicker
                name={t('MEDIA_FRECUENCIA.INTENSIDAD')}
                variable={intensidad}
                setVariable={setIntensidad}
                min={minIntensidad}
                max={maxIntensidad}
                step={stepIntensidad}
                unit='mA'
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
          <IonCol size={constants.dchColAprendizaje} className='cuerpo ion-no-padding ion-no-margin'>
            <IonContent>
              <ImageMapper />
            </IonContent>
          </IonCol>
        </IonRow>  
      </IonContent>
    </IonPage>
  );
};

export default MediaFrecuenciaSimulacion;