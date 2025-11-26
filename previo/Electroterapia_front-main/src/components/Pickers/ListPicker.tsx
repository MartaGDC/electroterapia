import "./ListPicker.css"
import { IonIcon, IonItem, IonList, IonSelect, IonSelectOption } from "@ionic/react";

const ListPicker: React.FC<{
  variable: any;
  onChange: any;
  label: string;
  placeholder: string;
  valueOptions: {name: string, value: any, disabled: boolean}[];
  disabled?: boolean;
  insideInput?: boolean
}> = ({
  variable, 
  onChange, 
  valueOptions, 
  label, 
  placeholder, 
  disabled = false, 
  insideInput = false
}) => {

  return (
    <IonItem className="selector" lines="full"
      style={ insideInput
        ? {
            height: "25px",
            display: "flex",
            alignItems: "center",
            width: "75px",
            textAlign: "end"
          }
        : undefined
      }
    >
      <IonSelect 
        interface="popover" 
        interfaceOptions={{ cssClass: 'custom-popover' }}
        justify="space-between"
        label={label}
        labelPlacement="floating"
        placeholder={placeholder}
        value={variable}
        disabled={disabled}
        onIonChange={(e) => onChange(e.detail.value)}
        color={'negro'}
      >
        {valueOptions.map((elm, idx) => (
          <IonSelectOption key={idx} disabled={elm.disabled} value={elm.value}>
            {elm.name}
          </IonSelectOption>
        ))}
      </IonSelect>
    </IonItem>
  );
};

export default ListPicker;