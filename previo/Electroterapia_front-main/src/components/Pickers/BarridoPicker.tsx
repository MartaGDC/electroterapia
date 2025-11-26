import { useEffect, useRef, useState } from "react";
import { minMax } from "../Logica/General";
import { IonItem, IonLabel, IonRange } from "@ionic/react";
import "./BarridoPicker.css"

const BarridoPicker: React.FC<{
  name: string;
  variable: {lower: number, upper: number};
  setVariable: React.Dispatch<React.SetStateAction<any>>;
  midValue: number;
  disabled?: boolean;
  min: number;
  max: number;
  step: number;
}> = ({name, variable, setVariable, midValue, disabled = false, min, max, step}) => {

  const prev = useRef<{lower: number, upper: number}>({lower: variable.lower, upper: variable.upper});

  const mid = (e: any) => {
    let lower = e.lower;
    let upper = e.upper;

    // Modificamos el valor que ha sido modificado por última vez
    if (lower != prev.current.lower) {
      // Se ha modificado el valor mínimo
      upper = midValue + (midValue - lower);

      // Establecemos min <= lower <= midValue y midValue <= upper <= max
      lower = minMax(lower, min, midValue);
      upper = minMax(upper, midValue, max);

      lower = midValue - (upper - midValue);

    } else if (upper != prev.current.upper) {
      // Se ha modificado el valor máximo
      lower = midValue - (upper - midValue);

      // Establecemos min <= lower <= midValue y midValue <= upper <= max
      lower = minMax(lower, min, midValue);
      upper = minMax(upper, midValue, max);
  
      upper = midValue + (midValue - lower);

    } else {
      lower = minMax(lower, min, midValue);
      upper = minMax(upper, midValue, max);

      // Se ha modificado el valor medio
      let lowerDiff = midValue - lower;
      let upperDiff = upper - midValue;

      if (lowerDiff < upperDiff) upper = midValue + lowerDiff;
      else if (upperDiff < lowerDiff) lower = midValue - upperDiff;


    }

    prev.current = {lower: lower, upper: upper};
    setVariable({lower: lower, upper: upper});
  };

  useEffect(() => {
    mid(variable);
  }, [midValue])

  return (
    <IonItem className="barrido-picker" lines="full">
      <div>
        <div>
          <p className='param-name'> {name} </p>
          <div className="range-value-box">
            <p className="p1-range">{variable.lower} - {variable.upper}</p>
            <p className='p-range'>
               Hz
            </p>
          </div>
        </div>
        <IonRange
          value={variable}
          min={min}
          max={max}
          onIonChange={(e) => mid(e.detail.value)}
          step={step}
          dualKnobs={true}
          pin={true}
          disabled={disabled || min == max}
          pinFormatter={(value) => value}
        />
      </div>
    </IonItem>
  );
}

export default BarridoPicker;