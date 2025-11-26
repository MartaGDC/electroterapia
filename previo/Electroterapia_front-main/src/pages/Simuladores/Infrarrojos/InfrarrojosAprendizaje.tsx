import './InfrarrojosAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tramosOptions, valueOptions } from '../../../components/Logica/General';
import { equipos, maxDistancia, minDistancia, opciones_gafas, potencias, stepDistancia } from './Infrarrojos';
import ListPicker from '../../../components/Pickers/ListPicker';
import TimePicker from '../../../components/Pickers/TimePicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import RangeColorPicker from '../../../components/Pickers/RangeColorPicker';
import TooglePicker from '../../../components/Pickers/TogglePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';

const InfrarrojosAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {simulating, paused, tiempoRestante, iniciar} = useLog();
  
  //////////////////////////////////////////////////////////////////////////////
  // Variables
  //////////////////////////////////////////////////////////////////////////////
  const [equipo, setEquipo] = useState<any>(null);

  const [potencia, setPotencia] = useState<any>(50);
  const [distancia, setDistancia] = useState(maxDistancia);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));

  const [bombillaPotente, setBombillaPotente] = useState<boolean>(false);

  const [gafas, setGafas] = useState(null);

  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {    
    setEquipo(null);
  
    setPotencia(50);
    setDistancia(maxDistancia);
    setTratamiento(new Time(0, 0));
  
    setBombillaPotente(false);
  
    setGafas(null);
  });

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPickers
  //////////////////////////////////////////////////////////////////////////////
  const equiOptions = valueOptions('INFRARROJOS.EQUIPO.OPCIONES', t, equipos.values, () => false);
  const gafasOptions = valueOptions('INFRARROJOS.GAFAS.OPCIONES', t, opciones_gafas.values, () => false);
  const tramosMsg = tramosOptions('INFRARROJOS.SECCIONES', t);
    
  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const iniciarTratamiento = () => {
    if (equipo == null) {
      present({ message: t('INFRARROJOS.ALERTAS.EQUIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (gafas == null) {
      present({ message: t('INFRARROJOS.ALERTAS.GAFAS'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('INFRARROJOS.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: {  } },
        Simuladores.INFRARROJOS
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
            <IonTitle> Infrarrojos </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
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
                infoMsg={equipo == equipos.REGULABLE ? t('INFRARROJOS.INFO_BOMBILLA') : ""}
                unit='W'
              />

              {/* Distancia */}
              <RangeColorPicker
                name={t('INFRARROJOS.DISTANCIA')}
                variable={distancia}
                setVariable={setDistancia}
                min={minDistancia}
                max={maxDistancia}
                step={stepDistancia}
                sections={[
                  {value: 20, color: constants.tramos.rojo, msg: tramosMsg[0]},
                  {value: 50, color: constants.tramos.verde, msg: tramosMsg[1]},
                  {value: 100, color: constants.tramos.verdeClaro, msg: tramosMsg[2]},
                  {value: maxDistancia, color: constants.tramos.blanco, msg: tramosMsg[3]},
                ]}
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

              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('INFRARROJOS.MATERIALES')} </h2>

              {/* Gafas */}
              <ListPicker
                variable={gafas}
                onChange={setGafas}
                label={t('INFRARROJOS.GAFAS.LABEL')}
                placeholder={t('INFRARROJOS.GAFAS.PH')}
                valueOptions={gafasOptions}
                disabled={simulating}
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

export default InfrarrojosAprendizaje;