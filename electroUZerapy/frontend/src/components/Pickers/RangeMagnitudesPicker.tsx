import "./RangeMagnitudesPicker.css"

import { IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPopover, IonRange } from "@ionic/react";
import { minMax } from "../Logica/General";
import { useEffect, useState } from "react";
import { informationCircleOutline } from "ionicons/icons";
import ListPicker from "./ListPicker";

const RangeMagnitudesPicker: React.FC<{
  name: string;
  variable: number;
  setVariable: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
  min: number;
  max: number;
  step: number;
  infoMsg?: string;
  magnitude: number;
  setMagnitude: React.Dispatch<React.SetStateAction<number>>;
  valueOptions: {name: string, value: any, disabled: boolean}[];
}> = ({
  name, variable, setVariable, disabled = false, min, max, step, infoMsg, magnitude, setMagnitude, valueOptions
}) => {
  const uniqueId = `info-popover-${name.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    setVariable(minMax(variable, min, max));
  }, [min, max]);

  return (
    <IonItem className="range-magnitude-picker" lines="full">
      <IonLabel className="ion-no-margin">
        <div>
          <p className="ion-align-items-center" style={{opacity: disabled ? "0.6" : "1"}}> 
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
          <div>
            <div className="range-value-box" style={{opacity: disabled ? "0.6" : "1"}}>
              <input 
                type="number"
                value={Math.round(variable * 100) / 100}
                min={min}
                max={max}
                step={step}
                onChange={(e) => setVariable(Number(e.target.value))}
                disabled={disabled || min == max}
              />
              <ListPicker
                variable={magnitude}
                onChange={setMagnitude}
                label=""
                placeholder=""
                valueOptions={valueOptions}
                disabled={disabled}
                insideInput={true}
              />
            </div>
          </div>
        </div>
        <IonRange
          value={variable}
          min={min}
          max={max}
          onIonChange={(e) => setVariable(minMax(e.detail.value, min, max))}
          step={step}
          pin={true}
          disabled={disabled || min == max}
          pinFormatter={(value) => value}
        />
      </IonLabel>
    </IonItem>
  );
};

export default RangeMagnitudesPicker;
