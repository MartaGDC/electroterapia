import { useEffect, useState } from "react";
import "./MaterialPicker.css";

import { IonItem, IonList, IonSelect, IonSelectOption } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { Electrodo } from "../../classes/Electrodos";
import { valueOptions } from "../Logica/General";
import { allAdhesivoSizes, allAgujaSizes, allCauchoSizes, MaterialAdhesivo, MaterialAguja, MaterialCaucho, valuesAgujaSizes, valuesCauchoAdhesivoSizes } from "../../classes/Materiales";

const MaterialPicker: React.FC<{
  electrodo: Electrodo;
  setElectrodo: React.Dispatch<React.SetStateAction<Electrodo>>;

  label1: string;
  label2: string;

  placeholder1: string;
  placeholder2: string;

  disabled1?: boolean;
  disabled2?: boolean;

  aguja?: boolean;
  caucho?: boolean;
  adhesivo?: boolean;
}> = ({ 
  electrodo, setElectrodo,
  label1, label2,
  placeholder1, disabled1 = false,
  placeholder2, disabled2 = false,
  aguja = false, caucho = false, adhesivo = false
}) => {
  const {t} = useTranslation();

  const materiales = [
    ...(aguja ? [{ name: t('MATERIALES.AGUJA'), value: "aguja" }] : []),
    ...(caucho ? [{ name: t('MATERIALES.CAUCHO'), value: "caucho" }] : []),
    ...(adhesivo ? [{ name: t('MATERIALES.ADHESIVO'), value: "adhesivo"}] : []),
  ];
  
  const [sizes, setSizes] = useState<{name: any, value: number, disabled: boolean}[]>([]);

  const agujaSizes = Array.from({ length: valuesAgujaSizes.length }, (_, i) => 
    { return { name: t(`TAMAÑOS_AGUJA.${i}`), value: valuesAgujaSizes[i], disabled: false}}
  );

  const cauchoSizes = Array.from({ length: valuesCauchoAdhesivoSizes.length }, (_, i) => 
    { return { name: t(`TAMAÑOS_CAUCHO_ADHESIVO.${i}`), value: valuesCauchoAdhesivoSizes[i], disabled: false}}
  );
  
  const adhesivoSizes = Array.from({ length: valuesCauchoAdhesivoSizes.length }, (_, i) => 
    { return { name: t(`TAMAÑOS_CAUCHO_ADHESIVO.${i}`), value: valuesCauchoAdhesivoSizes[i], disabled: false}}
  );
  
  useEffect(() => {
    if (electrodo.material?.type == "aguja") {
      setSizes(agujaSizes);
    } else if (electrodo.material?.type == "caucho") {
      setSizes(cauchoSizes);
    } else if (electrodo.material?.type == "adhesivo") {
      setSizes(adhesivoSizes);
    }
  }, [electrodo.material])

  return (
    <IonItem className="material-picker" lines="full">
      <IonSelect
        className="first"
        interface="popover"
        justify="space-between"
        label={label1}
        labelPlacement="floating"
        placeholder={placeholder1}
        value={electrodo.material?.type}
        disabled={disabled1}
        onIonChange={(e) => {
          const tipo = e.detail.value;
          setElectrodo((prev: Electrodo) => {
            let nuevoMaterial = null;
        
            switch (tipo) {
              case "aguja":
                nuevoMaterial = new MaterialAguja(null);
                break;
              case "caucho":
                nuevoMaterial = new MaterialCaucho(null);
                break;
              case "adhesivo":
                nuevoMaterial = new MaterialAdhesivo(null);
                break;
            }
        
            return new Electrodo(prev.x, prev.y, prev.type, prev.color, nuevoMaterial);
          });
        }}        color={'negro'}
      >
        {materiales.map((elm, i) => (
          <IonSelectOption key={i} value={elm.value}>
            {elm.name}
          </IonSelectOption>
        ))}
      </IonSelect>
      {electrodo.material != null &&
        <IonSelect
          className="second"
          interface="popover"
          justify="end"
          label={label2}
          labelPlacement="floating"
          placeholder={placeholder2}
          value={electrodo.material?.size}
          disabled={disabled2}
          onIonChange={(e) => setElectrodo((prev: Electrodo) => 
            prev.material?.type == "aguja" ? new Electrodo(prev.x, prev.y, prev.type, prev.color, new MaterialAguja(e.detail.value)) 
            : prev.material?.type == "caucho" ? new Electrodo(prev.x, prev.y, prev.type, prev.color, new MaterialCaucho(e.detail.value)) 
            : prev.material?.type == "adhesivo" ? new Electrodo(prev.x, prev.y, prev.type, prev.color, new MaterialAdhesivo(e.detail.value)) 
            : prev.setToNull()
          )}
          color={'negro'}
        >
          {sizes.map((elm, i) => (
            <IonSelectOption key={i} value={elm.value}>
              {elm.name}
            </IonSelectOption>
          ))}
        </IonSelect>
      }
    </IonItem>
  );
};

export default MaterialPicker;
