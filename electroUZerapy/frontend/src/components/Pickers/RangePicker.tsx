import "./RangePicker.css"

import { IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPopover, IonRange } from "@ionic/react";
import { minMax } from "../Logica/General";
import { useEffect, useState } from "react";
import { informationCircleOutline } from "ionicons/icons";

const RangePicker: React.FC<{
  name: string;
  variable: number;
  setVariable: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
  min: number;
  max: number;
  step: number;
  unit?: string;
  infoMsg?: string;
}> = ({
  name, variable, setVariable, disabled = false, min, max, step, infoMsg, unit = ""
}) => {
  const uniqueId = `info-popover-${name.replace(/\s+/g, "-").toLowerCase()}`;
  const [internalValue, setInternalValue] = useState(variable);

  useEffect(() => {
    setVariable(minMax(variable, min, max));
  }, [min, max]);

  // Siempre que cambie `variable` desde fuera, sincronizamos el valor interno
  useEffect(() => {
    setInternalValue(variable);
  }, [variable]);
  
  return (
    <IonItem className="range-picker" lines="full">
      <IonLabel className="ion-no-margin">
        <div >
          <p className="ion-align-items-center" style={{
            opacity: disabled ? "0.6" : "1",
          }}> 
            {name} 
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
          <div className="range-value-box" style={{ opacity: disabled ? "0.6" : "1" }}>
            <input 
              type="number"
              value={Math.round(variable * 100) / 100}
              min={min}
              max={max}
              step={step}
              onChange={(e) => setVariable(Number(e.target.value))}
              disabled={disabled || min == max}
            />
            {unit != "" &&
              <span>
                {unit}
              </span>
            }
          </div>
        </div>
        
        <IonRange
          key={variable}
          value={variable}
          min={min}
          max={max}
          onIonChange={(e) => {
            const raw = e.detail.value;
            setInternalValue(minMax(raw, min, max)); // cambia el valor temporal para reflejar el movimiento
            setVariable(minMax(raw, min, max)); // deja que la lógica externa lo ajuste si es necesario
          }}          
          step={step}
          pin={true}
          disabled={disabled || min == max}
          pinFormatter={(value) => value}
        />
      </IonLabel>
    </IonItem>
  );
};

export default RangePicker;