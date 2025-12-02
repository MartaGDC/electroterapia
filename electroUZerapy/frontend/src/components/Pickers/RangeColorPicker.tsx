import "./RangeColorPicker.css"

import { IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPopover, IonRange } from "@ionic/react";
import { minMax } from "../Logica/General";
import { useEffect, useState } from "react";
import { Tramo } from "../../constants/interfaces";
import { informationCircleOutline } from "ionicons/icons";

const RangeColorPicker: React.FC<{
  name: string;
  variable: number;
  setVariable: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
  min: number;
  max: number;
  step: number;
  sections: Tramo[];
  unit?: string;
  infoMsg?: string[];
}> = ({
  name, variable, setVariable, disabled = false, min, max, step, sections, unit, infoMsg
}) => {
  const uniqueId = `info-popover-${name.replace(/\s+/g, "-").toLowerCase()}`;
  const [tramo, setTramo] = useState<Tramo>(sections[0]);

  useEffect(() => {
    console.log("variable", variable)
    const newTramo = sections.findIndex((sect) => variable <= sect.value);
    console.log(newTramo)
    if (newTramo != -1) setTramo(sections[newTramo]);
  }, [variable, sections]);

  useEffect(() => {
    console.log(tramo)
  }, [tramo])

  return (
    <IonItem className="range-color-picker" lines="full">
      <IonLabel className="ion-margin-top ion-no-margin">
        <div style={{opacity: disabled ? "0.6": "1"}}>
          <p className="param-name"> 
            {name}
            {infoMsg &&
              <>
                <IonIcon 
                  className='info'
                  id={uniqueId} // ID único para cada ícono
                  color={'secondary'} 
                  src={informationCircleOutline}
                />
                <IonPopover className="popover-info ion-padding" trigger={uniqueId} triggerAction="click">
                  {/* <IonContent className="ion-padding scroll-y"> */}
                  <div className="ion-padding">
                    {infoMsg?.map((parrafo, idx) => (
                      <p key={idx}>{parrafo}</p>
                    ))}
                  </div>
                  {/* </IonContent> */}
                </IonPopover>
              </>
            }
          </p>
          <div className="range-value-box">
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
        {tramo &&
          <>
            <IonRange
              style={{ "--bar-background-active": tramo.color }}
              value={variable}
              min={min}
              max={max}
              onIonChange={(e) => setVariable(minMax(e.detail.value, min, max))}
              step={step}
              pin={true}
              disabled={disabled || min == max}
              pinFormatter={(value) => value}
            />
            {tramo && tramo.msg &&
              <p className="tramo-msg"> {tramo.msg} </p>
            }
          </>
        }
      </IonLabel>
    </IonItem>
  );
};

export default RangeColorPicker;
