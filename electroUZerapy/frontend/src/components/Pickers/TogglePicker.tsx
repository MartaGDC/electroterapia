import "./TogglePicker.css"
import { IonItem, IonToggle } from "@ionic/react";

const TooglePicker: React.FC<{
  name: string;
  variable: boolean;
  onChange: any;
  disabled?: boolean;
  msgTrue?: string;
  msgFalse?: string;
}> = ({
  name, variable, onChange, disabled = false, msgTrue = null, msgFalse = null
}) => {

  return (
    <>
      <IonItem className="toggle-picker" lines="full">
        <IonToggle 
          className="ion-margin-end"
          checked={variable} 
          onIonChange={onChange} 
          disabled={disabled}
        >
          {name} 
        </IonToggle>
        {variable && msgTrue !== null && (
        <p className="toggle-msg">{msgTrue}</p>
        )}
        {!variable && msgFalse !== null && (
          <p className="toggle-msg">{msgFalse}</p>
        )}

      </IonItem>
    </>
  );
};

export default TooglePicker;
