import { IonButton, IonContent, IonIcon, IonItem, IonPickerLegacy, IonPopover } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import "./TimePicker.css"
import { informationCircleOutline } from "ionicons/icons";
import { Time } from "../../constants/interfaces";

const TimePicker: React.FC<{
  variable: Time;
  setVariable: React.Dispatch<React.SetStateAction<Time>>;
  doAnimation?: boolean;
  pausa?: boolean;
  tiempoRestante?: Time;
  labelText?: string;
  disabled?: boolean;
  infoMsg?: string;
}> = ({ 
  variable, setVariable, doAnimation, pausa, tiempoRestante, labelText, disabled, infoMsg
}) => {
  
  // Para controlar el modal que se abre para seleccionar el tiempo
  const [isOpen, setIsOpen] = useState(false);

  const minutes = {
    name: "minutos",
    options: Array.from({ length: 120 }, (_, i) => ({
      text: `${i} min`,
      value: i
    }))
  };

  const seconds = {
    name: "segundos",
    options: Array.from({ length: 60 }, (_, i) => ({
      text: `${i} s`,
      value: i
    }))
  };

  const uniqueId = `info-popover-${labelText?.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <IonItem className="time-item" lines="full">
      <div className={`time ion-no-margin ion-align-items-center`}>
        <p> 
          {labelText ?? 'Tiempo de tratamiento'} 
          {infoMsg &&
            <>
              <IonIcon 
                className='info'
                id={uniqueId} // ID único para cada ícono
                color={'secondary'} 
                src={informationCircleOutline}
              />
              <IonPopover trigger={uniqueId} triggerAction='click'>
                <IonContent className='ion-padding'>
                  {infoMsg}
                </IonContent>
              </IonPopover>
            </>
          }

        </p>
        <IonButton 
          disabled={disabled ? disabled : doAnimation} 
          onClick={() => setIsOpen(true)}
        >
          {(doAnimation && tiempoRestante)
          ? `${tiempoRestante.minutes} min ${tiempoRestante.seconds} s` 
          : `${variable.minutes} min ${variable.seconds} s` }
        </IonButton>
        <IonPickerLegacy
          className="time-picker"
          isOpen={isOpen}
          onDidDismiss={() => setIsOpen(false)}
          columns={[minutes, seconds]}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
            },
            {
              text: "Aceptar",
              handler: (value) => {
                setVariable(new Time(value.minutos.value, value.segundos.value));
              },
            },
          ]}
        />
      </div>
    </IonItem>
  );
};

export default TimePicker;
