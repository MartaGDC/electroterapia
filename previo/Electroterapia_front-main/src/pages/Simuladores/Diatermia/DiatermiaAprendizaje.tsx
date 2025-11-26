import './DiatermiaAprendizaje.css'

import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { conductores, dutyCycles, electrodo_activo_bi, electrodo_activo_mo, electrodo_pasivo_bi, maxFrecBi, maxPotencia, minFrecBi, minPotencia, minTratamiento, modo_emision, stepFrecBi, stepPotencia, tipos } from './Diatermia';
import ListPicker from '../../../components/Pickers/ListPicker';
import TimePicker from '../../../components/Pickers/TimePicker';
import RangePicker from '../../../components/Pickers/RangePicker';
import constants from '../../../constants/constants';
import { Simuladores, Time } from '../../../constants/interfaces';
import { valueOptions } from '../../../components/Logica/General';
import { useLog } from '../../../context/logContext';
import LogButton from '../../../components/Logs/LogButton';

const DiatermiaAprendizaje: React.FC = () => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const {
    simulating, paused, tiempoRestante, iniciar
  } = useLog();

  //////////////////////////////////////////////////////////////////////////////
  // Parámetros
  //////////////////////////////////////////////////////////////////////////////
  const [tipo, setTipo] = useState(null);
  const [tratamiento, setTratamiento] = useState<Time>(new Time(0, 0));
  
  const [activo, setActivo] = useState<any>(null);
  const [pasivo, setPasivo] = useState<any>(null);
  
  const [frecuencia, setFrecuencia] = useState(0); // MHz
  const [potencia, setPotencia] = useState(0); // W
  const [emision, setEmision] = useState(null);
  const [dutyCycle, setDutyCycle] = useState<any>(null);

  //////////////////////////////////////////////////////////////////////////////
  // Opciones para ListPicker
  //////////////////////////////////////////////////////////////////////////////
  const tecOptions = valueOptions('DIATERMIA.TECNICAS.OPCIONES', t, tipos.values, () => false);
  const actBiOptions = valueOptions('DIATERMIA.ELECTRODOS.OPCIONES_ACT_BI', t, electrodo_activo_bi.values, () => false);
  const actMoOptions = valueOptions('DIATERMIA.ELECTRODOS.OPCIONES_ACT_MO', t, electrodo_activo_mo.values, () => false);
  const pasOptions = valueOptions('DIATERMIA.ELECTRODOS.OPCIONES_PAS', t, electrodo_pasivo_bi.values, () => false);
  const conOptions = valueOptions('DIATERMIA.CONDUCTOR.OPCIONES', t, conductores.values, () => false);
  const emiOptions = valueOptions('DIATERMIA.EMISION.OPCIONES', t, modo_emision.values, () => false);
  const dutyOptions = valueOptions('DIATERMIA.DUTY_CYCLE.OPCIONES', t, dutyCycles, (idx: any) => dutyCycles[idx] == 0);    
  
  //////////////////////////////////////////////////////////////////////////////
  // Reset de parámetros
  //////////////////////////////////////////////////////////////////////////////
  useIonViewWillEnter(() => {

    setTipo(null);
    setTratamiento(new Time(0, 0));
    
    setActivo(null);
    setPasivo(null);
    
    setFrecuencia(0); // MHz
    setPotencia(0); // W
    setEmision(null);
    setDutyCycle(null);
    
  });

  const cambiarTipo = (type: any) => {
    setActivo(null);
    setPasivo(null);

    setTipo(type);
    setTratamiento(minTratamiento);
    setEmision(null);

    if (type == tipos.D_CET) { // EPI Alta intensidad
      setFrecuencia(0.3);
      setPotencia(50);
    } else if (type == tipos.D_RET) { // EPI Baja intensidad
      setFrecuencia(0.3);
      setPotencia(50);
    } else if (type == tipos.D_DIE) { // tDCS
      setFrecuencia(0.48);
      setPotencia(50);
    }
  }
  
  //////////////////////////////////////////////////////////////////////////////
  // Simulación
  //////////////////////////////////////////////////////////////////////////////
  const iniciarTratamiento = () => {
    if (tipo == null) {
      present({ message: t('DIATERMIA.ALERTAS.TIPO'), duration: 4000, cssClass: "error-toast" });
    } else if (modo_emision == null) {
      present({ message: t('DIATERMIA.ALERTAS.MODO'), duration: 4000, cssClass: "error-toast" });
    } else if (dutyCycle == null) {
      present({ message: t('DIATERMIA.ALERTAS.RELACION'), duration: 4000, cssClass: "error-toast" });
    } else if (tratamiento.minutes == 0 && tratamiento.seconds == 0) {
      present({ message: t('DIATERMIA.ALERTAS.TRATAMIENTO'), duration: 4000, cssClass: "error-toast" });      
    } else {
      iniciar(
        "aprendizaje",
        tratamiento, 
        { tratamiento },
        { time: Date.now(), params: {  } },
        Simuladores.DIATERMIA
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
            <IonTitle> {t("DIATERMIA.DIATERMIA")} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='page-content'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColAprendizaje} className='ion-padding ion-no-margin'>
            <IonContent>
              {/* Tipo de diatermia */}
              <ListPicker
                variable={tipo}
                onChange={cambiarTipo}
                label={t('DIATERMIA.TECNICAS.LABEL')}
                placeholder={t('DIATERMIA.TECNICAS.PH')}
                valueOptions={tecOptions}
                disabled={simulating}
              />

              {/****************************************************************/}
              {/* Parámetros */}
              {/****************************************************************/}
              <h2 className='negro'> {t('DIATERMIA.PARAMETROS')} </h2>
              {/* Frecuencia */}
              <RangePicker
                name={t('DIATERMIA.FRECUENCIA')}
                variable={frecuencia}
                setVariable={setFrecuencia}
                min={minFrecBi}
                max={maxFrecBi}
                step={stepFrecBi}
                unit='MHz'
                disabled={tipo == tipos.D_DIE || simulating}
              />

              {/* Potencia */}
              <RangePicker
                name={t('DIATERMIA.POTENCIA')}
                variable={potencia}
                setVariable={setPotencia}
                min={minPotencia}
                max={maxPotencia}
                step={stepPotencia}
                unit='W'
              />

              {/* Modo de emisión */}
              <ListPicker
                variable={emision}
                onChange={(e: any) => {
                  setEmision(e);
                  setDutyCycle(e == modo_emision.CONTINUO ? dutyCycles[0] : null);
                }}
                label={t('DIATERMIA.EMISION.LABEL')}
                placeholder={t('DIATERMIA.EMISION.PH')}
                valueOptions={emiOptions}
                disabled={simulating && !paused}
              />

              {/* Relación de pulso */}
              <ListPicker
                variable={dutyCycle}
                onChange={setDutyCycle}
                label={t('DIATERMIA.DUTY_CYCLE.LABEL')}
                placeholder={t('DIATERMIA.DUTY_CYCLE.PH')}
                valueOptions={dutyOptions}
                disabled={emision == modo_emision.CONTINUO || (simulating && !paused)}
              />          

              <TimePicker
                variable={tratamiento}
                setVariable={setTratamiento}
                doAnimation={simulating}
                tiempoRestante={new Time(0, 0, tiempoRestante)}
                infoMsg={t('DIATERMIA.TIEMPO_MSG')}
              />

              <LogButton iniciar={iniciarTratamiento} />

              {/****************************************************************/}
              {/* Materiales */}
              {/****************************************************************/}
              <h2 className='negro'> {t('DIATERMIA.MATERIALES')} </h2>
              {/* Electrodo 1 */}
              {tipo != null &&
                <ListPicker
                  variable={activo}
                  onChange={setActivo}
                  label={t(`DIATERMIA.ELECTRODOS.ACTIVO_${tipo == tipos.D_DIE ? 'MONOPOLAR' : (tipo == tipos.D_CET) ? 'BIPOLAR_CAPACITIVO' : 'BIPOLAR_RESISTIVO'}.LABEL`)}
                  placeholder={t('DIATERMIA.ELECTRODOS.PH')}
                  valueOptions={tipo == tipos.D_DIE ? actMoOptions : actBiOptions}
                  disabled={tipo == null || (simulating && !paused)}
                />
              }
              {/* Electrodo 2 */}
              {(tipo == tipos.D_CET || tipo == tipos.D_RET) && 
                <ListPicker
                  variable={pasivo}
                  onChange={setPasivo}
                  label={t('DIATERMIA.ELECTRODOS.PASIVO.LABEL')}
                  placeholder={t('DIATERMIA.ELECTRODOS.PH')}
                  valueOptions={pasOptions}
                  disabled={tipo == null || (simulating && !paused)}
                />
              }

              {/* Conductor */}
              <ListPicker
                variable={tipo}
                onChange={setTipo} // Nunca se cambiará
                label={t('DIATERMIA.CONDUCTOR.CONDUCTOR')}
                placeholder={t('DIATERMIA.CONDUCTOR.PH')}
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
                    {t(`DIATERMIA.DIATERMIA`)} 
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

export default DiatermiaAprendizaje;