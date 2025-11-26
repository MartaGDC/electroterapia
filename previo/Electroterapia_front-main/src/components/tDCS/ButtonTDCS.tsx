import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PositionsTDCS } from '../../constants/interfaces';
import ImageTDCS from './ImagetDCS';
import "./ButtonTDCS.css"
import ListPicker from '../Pickers/ListPicker';

const ButtonTDCS: React.FC<{
  catodoTDCS: PositionsTDCS | null;
  anodoTDCS: PositionsTDCS | null;
  setCatodoTDCS: React.Dispatch<React.SetStateAction<PositionsTDCS | null>>;
  setAnodoTDCS: React.Dispatch<React.SetStateAction<PositionsTDCS | null>>;
  modo: "aprendizaje" | "simulacion" | "visualizador";
}> = ({
  catodoTDCS, anodoTDCS, setCatodoTDCS, setAnodoTDCS, modo = "aprendizaje"
}) => {
  const {t} = useTranslation();
  const modal = useRef<HTMLIonModalElement>(null);

  const [selectedElec, setSelectedElec] = useState<"catodo" | "anodo" | null>(null);
  const [showModal, setShowModal] = useState(false);

  const optionsTDCS = [
    { name: t('GALVANICA.TDCS.C3'), value: PositionsTDCS.C3, disabled: false },
    { name: t('GALVANICA.TDCS.C4'), value: PositionsTDCS.C4, disabled: false },
    { name: t('GALVANICA.TDCS.F3'), value: PositionsTDCS.F3, disabled: false },
    { name: t('GALVANICA.TDCS.F4'), value: PositionsTDCS.F4, disabled: false },
    { name: t('GALVANICA.TDCS.FP1'), value: PositionsTDCS.FP1, disabled: false },
    { name: t('GALVANICA.TDCS.FP2'), value: PositionsTDCS.FP2, disabled: false },

    { name: t('GALVANICA.TDCS.F7'), value: PositionsTDCS.F7, disabled: false },
    { name: t('GALVANICA.TDCS.F8'), value: PositionsTDCS.F8, disabled: false },
    { name: t('GALVANICA.TDCS.T3'), value: PositionsTDCS.T3, disabled: false },
    { name: t('GALVANICA.TDCS.T4'), value: PositionsTDCS.T4, disabled: false },
    { name: t('GALVANICA.TDCS.A1'), value: PositionsTDCS.A1, disabled: false },
    { name: t('GALVANICA.TDCS.A2'), value: PositionsTDCS.A2, disabled: false },
    { name: t('GALVANICA.TDCS.T5'), value: PositionsTDCS.T5, disabled: false },
    { name: t('GALVANICA.TDCS.T6'), value: PositionsTDCS.T6, disabled: false },
    { name: t('GALVANICA.TDCS.P3'), value: PositionsTDCS.P3, disabled: false },
    { name: t('GALVANICA.TDCS.P4'), value: PositionsTDCS.P4, disabled: false },
    { name: t('GALVANICA.TDCS.PZ'), value: PositionsTDCS.PZ, disabled: false },
    { name: t('GALVANICA.TDCS.CZ'), value: PositionsTDCS.CZ, disabled: false },
    { name: t('GALVANICA.TDCS.FZ'), value: PositionsTDCS.FZ, disabled: false },
    { name: t('GALVANICA.TDCS.O1'), value: PositionsTDCS.O1, disabled: false },
    { name: t('GALVANICA.TDCS.O2'), value: PositionsTDCS.O2, disabled: false },

  ];

  const selectButton = (param: "catodo" | "anodo") => {
    if (selectedElec == param) setSelectedElec(null);
    else setSelectedElec(param)
  };

  return (
    <>
      <IonButton className='tdcs-main-button' onClick={() => setShowModal(true)}> 
        {(modo == "aprendizaje" || modo == "simulacion")
          ? t('GALVANICA.TDCS.TITULO_APRENDIZAJE') 
          : t('GALVANICA.TDCS.TITULO_SIMULACION')
        }
      </IonButton>

      <IonModal className='modal-tdcs' isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle> 
              {(modo == "aprendizaje" || modo == "simulacion")
                ? t('GALVANICA.TDCS.TITULO_APRENDIZAJE') 
                : t('GALVANICA.TDCS.TITULO_SIMULACION')
              } 
            </IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => setShowModal(false)}> 
                {t('GALVANICA.TDCS.CONFIRMAR')} 
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {(modo == "aprendizaje" || modo == "simulacion") &&
            <div className='buttons-tdcs'>
              <div className='content-tdcs-modal'>
                <IonButton 
                  className={selectedElec == "anodo" ? "active-tdcs-elec" : ""} 
                  onClick={() => selectButton("anodo")}
                >
                  {t('GALVANICA.ELECTRODOS.ANODO.LABEL')} 
                </IonButton>
                <ListPicker
                  variable={anodoTDCS}
                  onChange={() => {}}
                  disabled={true}
                  label={t('GALVANICA.TDCS.LABEL')}
                  placeholder={t('GALVANICA.TDCS.PH')}
                  valueOptions={optionsTDCS}
                />
              </div>
              <div className='content-tdcs-modal'>
                <IonButton 
                  className={selectedElec == "catodo" ? "active-tdcs-elec" : ""} 
                  onClick={() => selectButton("catodo")}
                > 
                  {t('GALVANICA.ELECTRODOS.CATODO.LABEL')} 
                </IonButton>
                <ListPicker
                  variable={catodoTDCS}
                  onChange={() => {}}
                  disabled={true}
                  label={t('GALVANICA.TDCS.LABEL')}
                  placeholder={t('GALVANICA.TDCS.PH')}
                  valueOptions={optionsTDCS}
                />
              </div>
            </div>
          }

          <ImageTDCS 
            type={modo}
            elecSelected={selectedElec}
            anodoTDCS={anodoTDCS}
            catodoTDCS={catodoTDCS}
            setAnodoTDCS={setAnodoTDCS}
            setCatodoTDCS={setCatodoTDCS}
          />
        </IonContent>
      </IonModal>
    </>
  );
};

export default ButtonTDCS;