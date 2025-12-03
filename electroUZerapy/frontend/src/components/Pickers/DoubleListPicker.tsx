import "./DoubleListPicker.css";
import { IonItem, IonList, IonSelect, IonSelectOption } from "@ionic/react";

const DoubleListPicker: React.FC<{
  variable1: any;
  variable2: any;

  onChange1: ((value: any) => void);
  onChange2: ((value: any) => void);
  
  label1: string;
  label2: string;

  placeholder1: string;
  placeholder2: string;

  valueOptions1: { name: string; value: number; disabled: boolean }[];
  valueOptions2: { name: string; value: number; disabled: boolean }[];

  disabled1?: boolean;
  disabled2?: boolean;

  visible2?: boolean;
}> = ({ 
  label1, label2,
  variable1, onChange1, valueOptions1, placeholder1, disabled1 = false,
  variable2, onChange2, valueOptions2, placeholder2, disabled2 = false,
  visible2 = true
}) => {
  
  return (
    // <IonList className="double-picker">
    <IonItem className="double-picker" lines="full">
      <IonSelect
        className="first"
        interface="popover"
        justify="space-between"
        label={label1}
        labelPlacement="floating"
        placeholder={placeholder1}
        value={variable1}
        disabled={disabled1}
        onIonChange={(e) => onChange1(e.detail.value)}
        color={'blanco'}
        >
        {valueOptions1.map((elm, i) => (
          <IonSelectOption 
            key={i}
            disabled={elm.disabled} 
            value={elm.value}
          >
            {elm.name}
          </IonSelectOption>
        ))}
      </IonSelect>
      {visible2 &&
        <IonSelect
          className="second"
          interface="popover"
          justify="end"
          label={label2}
          labelPlacement="floating"
          placeholder={placeholder2}
          value={variable2}
          disabled={disabled2}
          onIonChange={(e) => onChange2(e.detail.value)}
          color={'blanco'}
        >
          {valueOptions2.map((elm, i) => (
            <IonSelectOption 
              key={i}
              disabled={elm.disabled} 
              value={elm.value}
            >
              {elm.name}
            </IonSelectOption>
          ))}
        </IonSelect>
      }
    </IonItem>
    // </IonList>
  );
};

export default DoubleListPicker;
