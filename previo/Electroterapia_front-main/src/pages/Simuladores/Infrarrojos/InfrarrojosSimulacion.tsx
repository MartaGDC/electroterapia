import './InfrarrojosSimulacion.css'

import { IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tramosOptions, valueOptions } from '../../../components/Logica/General';
import { equipos, maxDistancia, minDistancia, potencias, stepDistancia } from './Infrarrojos';
import ListPicker from '../../../components/Pickers/ListPicker';
import TimePicker from '../../../components/Pickers/TimePicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import TooglePicker from '../../../components/Pickers/TogglePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';
import ImageMapper from '../../../components/ImageMapper/ImageMapper';

const InfrarrojosSimulacion: React.FC<{
  type: "simulacion" | "evaluacion"
}> = ({
  type
}) => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, tiempoRestante, iniciar,
    agregarParams, reset
  } = useLog();
  
  //////////////////////////////////////////////////////////////////////////////
  // Variables
  //////////////////////////////////////////////////////////////////////////////
  const [equipo, setEquipo] = useState<any>(null);

  const [potencia, setPotencia] = useState<any>(50);
  const [distancia, setDistancia] = useState(maxDistancia);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));

  const [bombillaPotente, setBombillaPotente] = useState<boolean>(false);

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {    
    setEquipo(null);
  
    setPotencia(50);
    setDistancia(maxDistancia);
    setTratamiento(new Time(0, 0));
  
    setBombillaPotente(false);
  
    reset();
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPickers
  //////////////////////////////////////////////////////////////////////////////
  const equiOptions = valueOptions('INFRARROJOS.EQUIPO.OPCIONES', t, equipos.values, () => false);
    
  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const params = () => {
    return {
      potencia,
      distancia
    }
  }
  const iniciarTratamiento = () => {
    if (equipo == null) {
      present({ message: t('INFRARROJOS.ALERTAS.EQUIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('INFRARROJOS.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        type,
        tratamiento, 
        { tratamiento, equipo },
        { time: Date.now(), params: params() },
        Simuladores.INFRARROJOS
      )
    }
  }

  useEffect(() => {
    agregarParams({ time: Date.now(), params: params() });
  }, [potencia, distancia])

  return (
    <IonPage>
       <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={type == "simulacion" ? constants.simulacionIcon : constants.evaluacionIcon}/>
            <IonTitle> {t('INFRARROJOS.INFRARROJOS')} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColSimulacion} className='ion-padding ion-no-margin'>
            <IonContent>

              {/* Equipo */}
              <ListPicker
                variable={equipo}
                onChange={(e: any) => {
                  setPotencia(potencias[e].min);
                  setEquipo(e);
                }}
                label={t('INFRARROJOS.EQUIPO.LABEL')}
                placeholder={t('INFRARROJOS.EQUIPO.PH')}
                valueOptions={equiOptions}
                disabled={simulating}
              />

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('INFRARROJOS.PARAMETROS')} </h2>

              {equipo == equipos.REGULABLE &&
                <TooglePicker
                  name={t('INFRARROJOS.ALTA_POTENCIA')}
                  variable={bombillaPotente}
                  onChange={() => {
                    if (!bombillaPotente) setPotencia(1000);
                    else setPotencia(50);
                    setBombillaPotente(!bombillaPotente);
                  }}
                  disabled={simulating && equipo != equipos.REGULABLE}
                />
              }

              {/* Potencia */}
              <RangePicker
                name={t('INFRARROJOS.POTENCIA')}
                variable={potencia}
                setVariable={setPotencia}
                min={equipo == null ? 0 : potencias[equipo].min}
                max={equipo == null ? 0 : potencias[equipo].max}
                step={equipo == null ? 0 : potencias[equipo].step}
                disabled={(equipo == null || bombillaPotente) 
                  ? true 
                  : (potencias[equipo].min == potencias[equipo].max)
                }
                unit='W'
              />

              {/* Distancia */}
              <RangePicker
                name={t('INFRARROJOS.DISTANCIA')}
                variable={distancia}
                setVariable={setDistancia}
                min={minDistancia}
                max={maxDistancia}
                step={stepDistancia}
                unit='cm'
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

            </IonContent>
          </IonCol>
          {/* Parte derecha */}
          <IonCol size={constants.dchColSimulacion} className='cuerpo ion-no-padding ion-no-margin'>
            <IonContent>
              <ImageMapper />
            </IonContent>
          </IonCol>
        </IonRow>  
      </IonContent>
    </IonPage>
  );
};

export default InfrarrojosSimulacion;