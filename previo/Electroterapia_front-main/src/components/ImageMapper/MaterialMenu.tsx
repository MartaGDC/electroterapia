import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from "@ionic/react";
import { allComplementos, allFarmacos, allProductosConduccion, allProductosProteccion, Complemento } from "../../classes/Materiales";
import { useTranslation } from "react-i18next";
import { TipoElectrodo } from "../../classes/Electrodos";
import { useEffect, useState } from "react";
import { radioButtonOnOutline } from "ionicons/icons";

import "./MaterialMenu.css"
import { PositionsTDCS } from "../../constants/interfaces";
import ListPicker from "../Pickers/ListPicker";
import { valueOptions } from "../Logica/General";
import constants from "../../constants/constants";
import ButtonTDCS from "../tDCS/ButtonTDCS";
import MaterialSimulationPicker from "../Pickers/MaterialSimulationPicker";
import { useLog } from "../../context/logContext";
import { allAplicadores, Aplicadores } from "../../classes/Aplicadores";
import AplicadorSelector from "./AplicadorSelector";

const MaterialMenu: React.FC = () => {
  const {t} = useTranslation();
  const { 
    simulating,
    anodoCanal1, setAnodoCanal1, catodoCanal1, setCatodoCanal1, 
    anodoCanal2, setAnodoCanal2, catodoCanal2, setCatodoCanal2, 
    complemento, setComplemento, 
    anodoTDCS, setAnodoTDCS, catodoTDCS, setCatodoTDCS,
    aplicador1, setAplicador1, aplicador2, setAplicador2,
    conduccion, setConduccion, 
    proteccion, setProteccion,
    farmaco, setFarmaco
  } = useLog();

  const [isOpen, setIsOpen] = useState(false);
  const [typeAplicador, setTypeAplicador] = useState<null | 0 | 1>(null); // 1 = Electrodo, 2 = Aplicador

  //////////////////////////////////////////////////////////////////////////////
  // Options para List Pickers
  //////////////////////////////////////////////////////////////////////////////
  const complPickerOptions = valueOptions('MENU_MATERIALES.COMPLEMENTOS.COMPLEMENTO_OPTIONS', t, allComplementos, () => false);
  const conduPickerOptions = valueOptions('MENU_MATERIALES.CONDUCCION.CONDUCCION_OPTIONS', t, allProductosConduccion, () => false);
  const protPickerOptions = valueOptions('MENU_MATERIALES.PROTECCION.PROTECCION_OPTIONS', t, allProductosProteccion, () => false);
  const farmacosPickerOptions = valueOptions('MENU_MATERIALES.FARMACOS.OPCIONES', t, allFarmacos, () => false);
  const typeAplOptions = valueOptions('MENU_MATERIALES.APLICADOR.OPCIONES', t, [null, 0, 1], () => false);

  useEffect(() => {
    if (typeAplicador == 0 || typeAplicador == null) {
      setAplicador1(null);
      setAplicador2(null);
    }

    if (typeAplicador == 1 || typeAplicador == null) {
      setAnodoCanal1(null);
      setCatodoCanal1(null);
      setAnodoCanal2(null);
      setCatodoCanal2(null);
    }
  }, [typeAplicador])

  return (
    <>
    <div className="elec-menu">
      <div className="main-button">
        <IonButton 
          disabled={simulating} onClick={() => setIsOpen(true)}>
          <IonIcon src={radioButtonOnOutline}/>
        </IonButton>
      </div>
    </div>

    <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle> {t('MENU_MATERIALES.LEYENDA.TITULO')} </IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => setIsOpen(false)}> 
                {t('MENU_MATERIALES.LEYENDA.CONFIRMAR')} 
              </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        {/****************************************************************/}
        {/* Aplicador */}
        {/****************************************************************/}
        <h2 style={{display: "flex"}} className="ion-no-margin ion-align-items-center">
          <IonIcon src={constants.aplicadoresIcon}/>&nbsp;: {t('MENU_MATERIALES.APLICADOR.TITULO')} 
        </h2>
        <ListPicker
          variable={typeAplicador}
          onChange={setTypeAplicador}
          label={t('MENU_MATERIALES.APLICADOR.LABEL')}
          placeholder={t('MENU_MATERIALES.APLICADOR.PH')}
          valueOptions={typeAplOptions}
        />

        {typeAplicador == 0 &&
          <div className="ion-padding-start">
            {/****************************************************************/}
            {/* Canal 1 */}
            {/****************************************************************/}
            <h3 
              style={{display: "flex", fontWeight: "bold"}} 
              className="ion-no-margin ion-margin-top ion-align-items-center"
            >
              C1 : {t('MENU_MATERIALES.LEYENDA.CANAL1')} 
            </h3>
            <MaterialSimulationPicker
              electrodo={anodoCanal1}
              setElectrodo={setAnodoCanal1}
              elecType={TipoElectrodo.ANODO}
              canal={1}
              label1={t('MENU_MATERIALES.LEYENDA.ANODO1.LABEL1')}
              label2={t('MENU_MATERIALES.LEYENDA.ANODO1.LABEL2')}
              placeholder1={t('MENU_MATERIALES.ELECTRODOS.PH1')}
              placeholder2={t('MENU_MATERIALES.ELECTRODOS.PH2')}
              aguja
              caucho
              adhesivo
            />
            <MaterialSimulationPicker
              electrodo={catodoCanal1}
              setElectrodo={setCatodoCanal1}
              elecType={TipoElectrodo.CATODO}
              canal={1}
              label1={t('MENU_MATERIALES.LEYENDA.CATODO1.LABEL1')}
              label2={t('MENU_MATERIALES.LEYENDA.CATODO1.LABEL2')}
              placeholder1={t('MENU_MATERIALES.ELECTRODOS.PH1')}
              placeholder2={t('MENU_MATERIALES.ELECTRODOS.PH2')}
              aguja
              caucho
              adhesivo
            />

            {/****************************************************************/}
            {/* Canal 2 */}
            {/****************************************************************/}
            <h3 
              style={{display: "flex", fontWeight: "bold"}} 
              className="ion-no-margin ion-margin-top ion-align-items-center"
            >
              C2 : {t('MENU_MATERIALES.LEYENDA.CANAL2')} 
            </h3>
            <MaterialSimulationPicker
              electrodo={anodoCanal2}
              setElectrodo={setAnodoCanal2}
              elecType={TipoElectrodo.ANODO}
              canal={2}
              label1={t('MENU_MATERIALES.LEYENDA.ANODO2.LABEL1')}
              label2={t('MENU_MATERIALES.LEYENDA.ANODO2.LABEL2')}
              placeholder1={t('MENU_MATERIALES.ELECTRODOS.PH1')}
              placeholder2={t('MENU_MATERIALES.ELECTRODOS.PH2')}
              aguja
              caucho
              adhesivo
            />
            <MaterialSimulationPicker
              electrodo={catodoCanal2}
              setElectrodo={setCatodoCanal2}
              elecType={TipoElectrodo.CATODO}
              canal={2}
              label1={t('MENU_MATERIALES.LEYENDA.CATODO2.LABEL1')}
              label2={t('MENU_MATERIALES.LEYENDA.CATODO2.LABEL2')}
              placeholder1={t('MENU_MATERIALES.ELECTRODOS.PH1')}
              placeholder2={t('MENU_MATERIALES.ELECTRODOS.PH2')}
              aguja
              caucho
              adhesivo
            />
          </div>
        }
        
        {typeAplicador == 1 &&
          <AplicadorSelector/>
        }

        {/****************************************************************/}
        {/* Complemento */}
        {/****************************************************************/}
        <h2 style={{display: "flex"}} className="ion-no-margin ion-margin-top ion-align-items-center">
          <IonIcon src={constants.complementosIcon}/>&nbsp;: {t('MENU_MATERIALES.COMPLEMENTOS.LABEL')} 
        </h2>

        <IonList>
          {complPickerOptions.map((com, idx) => (
            <IonItem key={idx} lines="full">
              <IonCheckbox 
                checked={complemento[idx]} 
                onIonChange={() => setComplemento(complemento.map((c, i) => i == idx ? !c : c))}
              >
                {com.name}
              </IonCheckbox>
            </IonItem>
          ))}
        </IonList>
        {complemento[Complemento.GORRO_TDCS] == true &&
          <ButtonTDCS
            modo="simulacion"
            anodoTDCS={anodoTDCS}
            setAnodoTDCS={setAnodoTDCS}
            catodoTDCS={catodoTDCS}
            setCatodoTDCS={setCatodoTDCS}
          />
        }

        {/****************************************************************/}
        {/* Producto de conducción */}
        {/****************************************************************/}
        <h2 style={{display: "flex"}} className="ion-no-margin ion-margin-top ion-align-items-center">
          <IonIcon src={constants.conduccionIcon}/>&nbsp;: {t('MENU_MATERIALES.CONDUCCION.LABEL')} 
        </h2>
        <IonList>
          {conduPickerOptions.map((con, idx) => (
            <IonItem key={idx} lines="full">
              <IonCheckbox 
                value={conduccion[idx]} 
                onIonChange={() => setConduccion(conduccion.map((c, i) => i == idx ? !c : c))}
              >
                {con.name}
              </IonCheckbox>
            </IonItem>
          ))}
        </IonList>

        {/****************************************************************/}
        {/* Producto de protección */}
        {/****************************************************************/}
        <h2 style={{display: "flex"}} className="ion-no-margin ion-margin-top ion-align-items-center">
          <IonIcon src={constants.proteccionIcon}/>&nbsp;: {t('MENU_MATERIALES.PROTECCION.LABEL')} 
        </h2>
        
        <IonList>
          {protPickerOptions.map((pro, idx) => (
            <IonItem key={idx} lines="full">
              <IonCheckbox 
                value={proteccion[idx]} 
                onIonChange={() => setProteccion(proteccion.map((c, i) => i == idx ? !c : c))}
              >
                {pro.name}
              </IonCheckbox>
            </IonItem>
          ))}
        </IonList>

        {/****************************************************************/}
        {/* Fármacos */}
        {/****************************************************************/}
        <h2 style={{display: "flex"}} className="ion-no-margin ion-margin-top ion-align-items-center">
          <IonIcon src={constants.farmacosIcon}/>&nbsp;: {t('MENU_MATERIALES.FARMACOS.LABEL')} 
        </h2>
        
        <IonList>
          {farmacosPickerOptions.map((far, idx) => (
            <IonItem key={idx} lines="full">
              <IonCheckbox 
                value={farmaco[idx]} 
                onIonChange={() => setFarmaco(farmaco.map((c, i) => i == idx ? !c : c))}
              >
                {far.name}
              </IonCheckbox>
            </IonItem>
          ))}
        </IonList>

      </IonContent>
    </IonModal>
    </>
  );
}

export default MaterialMenu;