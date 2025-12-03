import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RangePicker from '../Pickers/RangePicker';
import { Time } from '../../constants/interfaces';
import { irradianciaCalc } from '../../classes/UV';
import TimePicker from '../Pickers/TimePicker';
import "./Calculadora.css"

const ButtonCalculadora: React.FC = () => {
  const {t} = useTranslation();
  const modal = useRef<HTMLIonModalElement>(null);

  //////////////////////////////////////////////////////////////////////////////
  // Parámetros calculadora
  //////////////////////////////////////////////////////////////////////////////
  const [irradianciaCalculadora, setIrradianciaCalculadora] = useState(irradianciaCalc.min);
  const [tiempoCalculadora, setTiempoCalculadora] = useState(new Time(0, 0));
  const [dosisCalculadora, setDosisCalculadora] = useState(0);

  // Calcula automáticamente la dosis de la calculadora
  useEffect(() => {
    setDosisCalculadora((irradianciaCalculadora / 1000) * tiempoCalculadora.toSeconds());
  }, [irradianciaCalculadora, tiempoCalculadora])
  
  return (
    <>
      <IonButton className='calc-main-button' id='open-electrodos'> 
        {t('ULTRAVIOLETAS.CALCULADORA.TITULO')} 
      </IonButton>

      <IonModal className='modal-tdcs' ref={modal} trigger="open-electrodos">
        <IonHeader>
          <IonToolbar>
            <IonTitle> {t('ULTRAVIOLETAS.CALCULADORA.TITULO')} </IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => modal.current?.dismiss()}> 
                {t('GALVANICA.TDCS.CONFIRMAR')} 
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p style={{fontWeight: "bold"}}> 
            {t('ULTRAVIOLETAS.CALCULADORA.FORMULA')}
          </p>

          {/* Irradiancia de la calculadora */}
          <RangePicker
            name={t('ULTRAVIOLETAS.CALCULADORA.IRRADIANCIA')}
            variable={irradianciaCalculadora}
            setVariable={setIrradianciaCalculadora}
            min={irradianciaCalc.min}
            max={irradianciaCalc.max}
            step={irradianciaCalc.step}
            unit='mW/cm²'
          />

          {/* Tiempo de la calculadora */}
          <TimePicker
            variable={tiempoCalculadora}
            setVariable={setTiempoCalculadora}
          />

          <IonItem  lines='full'>
            <div className='item-dosis'>
              <p> {t('ULTRAVIOLETAS.CALCULADORA.DOSIS')} </p>
              <p> {dosisCalculadora} J/cm² </p>
            </div>
          </IonItem>
        </IonContent>
      </IonModal>
    </>
  );
};

export default ButtonCalculadora;