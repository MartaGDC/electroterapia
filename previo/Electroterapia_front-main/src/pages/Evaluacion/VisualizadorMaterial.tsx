import { IonIcon, IonItem } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Log, Simuladores, stringToPositionTDCS } from '../../constants/interfaces';
import { Electrodo, TipoElectrodo } from '../../classes/Electrodos';
import { Aplicador } from '../../classes/Aplicadores';
import { useTranslation } from 'react-i18next';
import MaterialPicker from '../../components/Pickers/MaterialPicker';
import { AplicadorDiatermia, AplicadorInfrarrojos, AplicadorLaser, AplicadorMagnetoterapia, AplicadorMicroondas, AplicadorOndaCorta, AplicadorOndasChoque, AplicadorUltrasonidos, AplicadorUltravioletas } from '../../classes/TiposAplicadores';
import ListPicker from '../../components/Pickers/ListPicker';
import { valueOptions } from '../../components/Logica/General';
import { allComplementos, allFarmacos, allProductosConduccion, allProductosProteccion } from '../../classes/Materiales';
import constants from '../../constants/constants';
import ButtonTDCS from '../../components/tDCS/ButtonTDCS';

const VisualizadorMaterial: React.FC<{
  log: Log | null;
  visible: boolean;
}> = ({
  log, visible
}) => {
  const {t} = useTranslation();

  const [electrodoFalso, setElectrodoFalso] = useState<Electrodo>(new Electrodo(undefined, undefined, TipoElectrodo.OTRO));

  const [electrodos, setElectrodos] = useState<any[]>([]);
  const [aplicadores, setAplicadores] = useState<any[]>([]);

  const complOptions = valueOptions('MENU_MATERIALES.COMPLEMENTOS.COMPLEMENTO_OPTIONS', t, allComplementos, () => false);
  const condOptions = valueOptions('MENU_MATERIALES.CONDUCCION.CONDUCCION_OPTIONS', t, allProductosConduccion, () => false);
  const protOptions = valueOptions('MENU_MATERIALES.PROTECCION.PROTECCION_OPTIONS', t, allProductosProteccion, () => false);
  const farmOptions = valueOptions('MENU_MATERIALES.FARMACOS.OPCIONES', t, allFarmacos, () => false);

  const constructElectrodo = (e: any) => {
    return e == null ? null : new Electrodo(e.x, e.y, e.type, e.color, e.material, e.canal);
  }

  const constructAplicador = (a: any) => {
    if (a == null) return null;
    else if (a.modo.name == Simuladores.DIATERMIA) {
      return new Aplicador(a.x, a.y, new AplicadorDiatermia(a.modo.type, a.modo.modoDiatermia, a.modo.size), a.color);
    } else if (a.modo.name == Simuladores.ONDACORTA) {
      return new Aplicador(a.x, a.y, new AplicadorOndaCorta(a.modo.size), a.color);
    } else if (a.modo.name == Simuladores.MICROONDAS) {
      return new Aplicador(a.x, a.y, new AplicadorMicroondas(a.modo.size), a.color);
    } else if (a.modo.name == Simuladores.INFRARROJOS) {
      return new Aplicador(a.x, a.y, new AplicadorInfrarrojos(), a.color);
    } else if (a.modo.name == Simuladores.LASER) {
      return new Aplicador(a.x, a.y, new AplicadorLaser(a.modo.type, a.modo.size), a.color);
    } else if (a.modo.name == Simuladores.ULTRAVIOLETAS) {
      return new Aplicador(a.x, a.y, new AplicadorUltravioletas(), a.color);
    } else if (a.modo.name == Simuladores.MAGNETOTERAPIA) {
      return new Aplicador(a.x, a.y, new AplicadorMagnetoterapia(a.modo.type, a.modo.size), a.color);
    } else if (a.modo.name == Simuladores.ULTRASONIDOS) {
      return new Aplicador(a.x, a.y, new AplicadorUltrasonidos(a.modo.size), a.color);
    } else if (a.modo.name == Simuladores.ONDASCHOQUE) {
      return new Aplicador(a.x, a.y, new AplicadorOndasChoque(a.modo.type, a.modo.size), a.color);
    } else return null;
  }

  useEffect(() => {
    if (log !== null) {
      // Electrodos y aplicadores
      const elecOpts = [
        { param: log.params[0].params.anodoCanal1, label1: t('MENU_MATERIALES.LEYENDA.ANODO1.LABEL1') },
        { param: log.params[0].params.catodoCanal1, label1: t('MENU_MATERIALES.LEYENDA.CATODO1.LABEL1') },
        { param: log.params[0].params.anodoCanal2, label1: t('MENU_MATERIALES.LEYENDA.ANODO2.LABEL1') },
        { param: log.params[0].params.catodoCanal2, label1: t('MENU_MATERIALES.LEYENDA.CATODO2.LABEL1') }
      ]
      const elecArray: any[] = [];

      elecOpts.map((el) => {
        const e = constructElectrodo(el.param);
        if (e != null) elecArray.push({
          elec: e,
          label1: el.label1, label2: t('MENU_MATERIALES.ELECTRODOS.LABEL2'),
          placeholder1: t('MENU_MATERIALES.ELECTRODOS.PH1'),
          placeholder2: t('MENU_MATERIALES.ELECTRODOS.PH2'),
        })
      });
      setElectrodos(elecArray);

      const aplOpts = [
        {param: log.params[0].params.aplicador1, label1: t('MENU_MATERIALES.APLICADOR.APLICADOR.LABEL')},
        {param: log.params[0].params.aplicador2, label1: t('MENU_MATERIALES.APLICADOR.APLICADOR.LABEL')},
      ];
      const aplArray: any[] = [];

      aplOpts.map((el) => {
        const e = constructAplicador(el.param);
        if (e != null) aplArray.push({
          apl: e,
          label: el.label1, placeholder: t('MENU_MATERIALES.ELECTRODOS.PH1'),
        })
      })
      setAplicadores(aplArray)
    }
  }, [log]);

  return (
    <>
      {visible &&
        <>
          <IonItem lines='full'>
            <p style={{fontWeight: "bold"}}>
              <IonIcon src={constants.aplicadoresIcon}/>&nbsp;: {t('MENU_MATERIALES.APLICADOR.TITULO')} 
            </p>
          </IonItem>
          {electrodos.map((el, idx) => (
            <>

              {el.elec != null && 
                <MaterialPicker
                  key={idx}
                  electrodo={el.elec}
                  setElectrodo={setElectrodoFalso}
                  label1={el.label1}
                  label2={el.label2}
                  placeholder1={el.placeholder1}
                  placeholder2={el.placeholder2}
                  aguja
                  adhesivo
                  caucho
                  disabled1
                  disabled2
                />
              }
            </>
          ))}
          {aplicadores.map((el, idx) => (
            <ListPicker
              key={idx}
              variable={0}
              onChange={() => {}}
              label={el.label}
              placeholder=''
              valueOptions={[{name: el.apl.modo?.toString(), value: 0, disabled: false}]}
              disabled
            />
          ))}

          <IonItem lines='full'>
            <p style={{fontWeight: "bold"}}>
              <IonIcon src={constants.complementosIcon}/>&nbsp;: {t('MENU_MATERIALES.COMPLEMENTOS.LABEL')} 
            </p>
          </IonItem>

          {log && log.fixedParams.complemento.map((el: boolean, idx: number) => (
            el && <IonItem lines='full' key={idx}>
              {complOptions[idx].name}
            </IonItem>
          ))}

          {log && log.fixedParams.anodoTDCS && log.fixedParams.catodoTDCS &&
            <ButtonTDCS 
              anodoTDCS={stringToPositionTDCS[log.fixedParams.anodoTDCS]}
              catodoTDCS={stringToPositionTDCS[log.fixedParams.catodoTDCS]}
              setAnodoTDCS={() => {}}
              setCatodoTDCS={() => {}}
              modo='visualizador'
            />
          }

          <IonItem lines='full'>
            <p style={{fontWeight: "bold"}}>
              <IonIcon src={constants.conduccionIcon}/>&nbsp;: {t('MENU_MATERIALES.CONDUCCION.LABEL')} 
            </p>
          </IonItem>
          {log && log.fixedParams.conduccion.map((el: boolean, idx: number) => (
            el && <IonItem lines='full' key={idx}>
              {condOptions[idx].name}
            </IonItem>
          ))}

          <IonItem lines='full'>
            <p style={{fontWeight: "bold"}}>
              <IonIcon src={constants.proteccionIcon}/>&nbsp;: {t('MENU_MATERIALES.PROTECCION.LABEL')} 
            </p>
          </IonItem>
          {log && log.fixedParams.proteccion.map((el: boolean, idx: number) => (
            el && <IonItem lines='full' key={idx}>
              {protOptions[idx].name}
            </IonItem>
          ))}
          
          <IonItem lines='full'>
            <p style={{fontWeight: "bold"}}>
              <IonIcon src={constants.farmacosIcon}/>&nbsp;: {t('MENU_MATERIALES.FARMACOS.LABEL')} 
            </p>
          </IonItem>
          {log && log.fixedParams.farmaco.map((el: boolean, idx: number) => (
            el && <IonItem lines='full' key={idx}>
              {farmOptions[idx].name}
            </IonItem>
          ))}

        </>
      }
    </>
  );
};

export default VisualizadorMaterial;