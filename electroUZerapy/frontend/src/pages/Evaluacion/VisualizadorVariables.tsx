import { IonIcon, IonItem } from '@ionic/react';
import React, { useState } from 'react';
import { Log, Simuladores, Time } from '../../constants/interfaces';
import { useTranslation } from 'react-i18next';
import ListPicker from '../../components/Pickers/ListPicker';
import { valueOptions } from '../../components/Logica/General';
import RangePicker from '../../components/Pickers/RangePicker';
import { diatermia } from '../../classes/Diatermia';
import { onda_corta } from '../../classes/OndaCorta';
import { microondas } from '../../classes/MicroOndas';
import { infrarrojos } from '../../classes/Infrarrojos';
import { laser } from '../../classes/Laser';
import { ultravioletas } from '../../classes/UV';
import { magnetoterapia } from '../../classes/Magnetoterapia';
import { ultrasonidos } from '../../classes/Ultrasonidos';
import { ondaschoque } from '../../classes/OndasChoque';
import { galvanica } from '../../classes/Galvanica';
import { caretDownOutline, caretForwardOutline } from 'ionicons/icons';
import { monofasica } from '../../classes/Monofasica';
import { bifasica } from '../../classes/Bifasica';
import { mediafrecuencia } from '../../classes/MediaFrecuencia';
import BarridoPicker from '../../components/Pickers/BarridoPicker';

import icon_1_1 from '../../assets/1-1.svg'
import icon_1_5_1_5 from '../../assets/1-5-1-5.svg'
import icon_1_30_1_30 from '../../assets/1-30-1-30.svg'
import icon_6_6 from '../../assets/6-6.svg'
import icon_12_12 from '../../assets/12-12.svg'

const VisualizadorVariables: React.FC<{
  log: Log | null;
  visible: boolean;
  selectedParamIdx: number | null;
  setSelectedParamIdx: React.Dispatch<React.SetStateAction<number | null>>;
}> = ({
  log, visible, selectedParamIdx, setSelectedParamIdx
}) => {
  const {t} = useTranslation();

  const [timeFalso, setTimeFalso] = useState<Time>(new Time(0,0));

  // Options
  const formMonofasicaOptions = valueOptions('MONOFASICA.FORMA_ONDA.OPCIONES', t, monofasica.FORMASONDA.values, () => false);
  const formBifasicaOptions = valueOptions('BIFASICA.FORMA_ONDA.OPCIONES', t, bifasica.FORMASONDA.values, () => false);
  const modoMediaOptions = valueOptions('MEDIA_FRECUENCIA.MODO.OPCIONES', t, mediafrecuencia.MODOS_APLICACION.values, () => false);
  const vecMediaOptions = valueOptions('MEDIA_FRECUENCIA.VECTOR.OPCIONES', t, mediafrecuencia.VECTORES.values, () => false);  
  const contMediaOptions = valueOptions('MEDIA_FRECUENCIA.CONTORNOS.OPCIONES', t, mediafrecuencia.CONTORNOS.values, () => false);
  const contPersMediaOptions = valueOptions('MEDIA_FRECUENCIA.CONTORNOS_PERSONALIZADO.OPCIONES', t, mediafrecuencia.CONTORNOS_PERSONALIZADO.values, () => false);
  const emiDiatermiaOptions = valueOptions('DIATERMIA.EMISION.OPCIONES', t, diatermia.MODO_EMISION.values, () => false);
  const dutyDiatermiaOptions = valueOptions('DIATERMIA.DUTY_CYCLE.OPCIONES', t, diatermia.DUTYCYCLES, () => false);    
  const emiOndaCortaOptions = valueOptions('ONDA_CORTA.EMISION.OPCIONES', t, onda_corta.MODO_EMISION.values, () => false);
  const dutyOndaCortaOptions = valueOptions('ONDA_CORTA.DUTY_CYCLE.OPCIONES', t, onda_corta.DUTY_CYCLES, () => false);
  const emiMicroondasOptions = valueOptions('MICROONDAS.EMISION.OPCIONES', t, microondas.MODO_EMISION.values, () => false);
  const dutyMicroondasOptions = valueOptions('MICROONDAS.DUTY_CYCLE.OPCIONES', t, microondas.DUTYCYCLES, () => false);
  const emiLaserOptions = valueOptions('LASER.EMISION.OPCIONES', t, laser.MODOS_EMISION.values, () => false);
  const emiMagneOptions = valueOptions('MAGNETOTERAPIA.EMISION.OPCIONES', t, magnetoterapia.MODOS_EMISION.values, () => false);
  const emiUSOptions = valueOptions('ULTRASONIDOS.EMISION.OPCIONES', t, ultrasonidos.MODO_EMISION.values, () => false);
  const relUSOptions = valueOptions('ULTRASONIDOS.RELACION.OPCIONES', t, ultrasonidos.RELACION_PULSO, () => false);

  return (
    <>
      {visible && log &&
        <>
          {log.params.map((el, idx) => (
            <div key={idx}>
              <IonItem 
                lines='full'
                onClick={() => setSelectedParamIdx(selectedParamIdx == idx ? null : idx)}
              >
                {idx}
                <IonIcon 
                  slot='end'
                  src={selectedParamIdx == idx ? caretDownOutline : caretForwardOutline}
                />
              </IonItem>
              {selectedParamIdx == idx &&
                <>
                  {log.simulator == Simuladores.GALVANICA &&
                    <RangePicker
                      name={t('GALVANICA.INTENSIDAD')}
                      variable={log.params[idx].params.intensidad}
                      setVariable={() => {}}
                      min={galvanica.INTENSIDAD.min}
                      max={galvanica.INTENSIDAD.max}
                      step={galvanica.INTENSIDAD.step}
                      unit='mA'
                      disabled
                    />
                  }
                  {log.simulator == Simuladores.MONOFASICA &&
                    <>
                      <ListPicker
                        variable={log.params[idx].params.formaOnda}
                        onChange={() => {}}
                        label={t('MONOFASICA.FORMA_ONDA.LABEL')}
                        placeholder={t('MONOFASICA.FORMA_ONDA.PH')}
                        valueOptions={formMonofasicaOptions}
                        disabled
                      />
                      <RangePicker
                        name={t('MONOFASICA.ANCHURA')}
                        variable={log.params[idx].params.anchura}
                        setVariable={() => {}}
                        min={0}
                        max={1000}
                        step={0.1}
                        unit='ms'
                        disabled
                      />
                      <RangePicker
                        name={t('MONOFASICA.FRECUENCIA')}
                        variable={log.params[idx].params.frecuencia}
                        setVariable={() => {}}
                        unit='Hz'
                        min={monofasica.FRECUENCIA.min}
                        max={monofasica.FRECUENCIA.max}
                        step={monofasica.FRECUENCIA.step}
                        disabled
                      />
                      <RangePicker
                        name={t('MONOFASICA.DURACION_PAUSA')}
                        variable={log.params[idx].params.tiempoPausa}
                        setVariable={() => {}}
                        min={0}
                        max={1000}
                        step={0.1}
                        unit='s'
                        disabled
                      />
                      <RangePicker
                        name={t('MONOFASICA.INTENSIDAD.INTENSIDAD')}
                        variable={log.params[idx].params.intensidad}
                        setVariable={() => {}}
                        unit='mA'
                        min={monofasica.INTENSIDAD.min}
                        max={monofasica.INTENSIDAD.max}
                        step={monofasica.INTENSIDAD.step}
                        disabled
                      />
                    </>
                  }
                  {log.simulator == Simuladores.BIFASICA &&
                    <>
                      <ListPicker
                        variable={log.params[idx].params.formaOnda}
                        onChange={() => {}}
                        label={t('BIFASICA.FORMA_ONDA.LABEL')}
                        placeholder={t('BIFASICA.FORMA_ONDA.PH')}
                        valueOptions={formBifasicaOptions}
                        disabled
                      />
                      <RangePicker
                        name={t('BIFASICA.ANCHURA')}
                        variable={log.params[idx].params.anchura}
                        setVariable={() => {}}
                        min={bifasica.ANCHURA.min}
                        max={bifasica.ANCHURA.max}
                        step={bifasica.ANCHURA.step}
                        unit='µs'
                        disabled
                      />
                      <RangePicker
                        name={t('BIFASICA.FRECUENCIA')}
                        variable={log.params[idx].params.frecuencia}
                        setVariable={() => {}}
                        min={bifasica.FRECUENCIA.min}
                        max={bifasica.FRECUENCIA.max}
                        step={bifasica.FRECUENCIA.step}
                        unit='Hz'
                        disabled
                      />
                      {log.params[idx].params.frecuenciaTren &&
                        <RangePicker
                          name={t('BIFASICA.TRENES')}
                          variable={log.params[idx].params.frecuenciaTren}
                          setVariable={() => {}}
                          min={bifasica.FRECUENCIATRENES.min}
                          max={bifasica.FRECUENCIATRENES.max}
                          step={bifasica.FRECUENCIATRENES.step}
                          unit='Hz'
                          disabled
                        />
                      }
                      {log.params[idx].params.anchuraTren &&
                        <RangePicker
                          name={t('BIFASICA.ANCHURA_TREN')}
                          variable={log.params[idx].params.anchuraTren}
                          setVariable={() => {}}
                          min={0}
                          max={500}
                          step={1}
                          unit='ms'
                          disabled
                        />
                      }
                      <RangePicker
                        name={t('BIFASICA.INTENSIDAD')}
                        variable={log.params[idx].params.intensidad}
                        setVariable={() => {}}
                        min={bifasica.INTENSIDAD.min}
                        max={bifasica.INTENSIDAD.max}
                        step={bifasica.INTENSIDAD.step}
                        unit='mA'
                        disabled
                      />
                    </>
                  }
                  {log.simulator == Simuladores.MEDIAFRECUENCIA &&
                    <>
                      <ListPicker
                        variable={log.params[idx].params.modo}
                        onChange={() => {}}
                        label={t('MEDIA_FRECUENCIA.MODO.LABEL')}
                        placeholder={t('MEDIA_FRECUENCIA.MODO.PH')}
                        valueOptions={modoMediaOptions}
                        disabled
                      />
                      <RangePicker
                        name={`${t('MEDIA_FRECUENCIA.FRECUENCIA')} ${(log.params[idx].params.modo == mediafrecuencia.MODOS_APLICACION.M_TETRAPOLAR) ? "1" : ""}`}
                        variable={log.params[idx].params.frecuenciaPortadora}
                        setVariable={() => {}}
                        min={mediafrecuencia.FRECUENCIAPORTADORA.min}
                        max={mediafrecuencia.FRECUENCIAPORTADORA.max}
                        step={mediafrecuencia.FRECUENCIAPORTADORA.step}
                        unit='Hz'
                        disabled
                      />
                      {log.params[idx].params.frecuenciaPortadora2 &&
                        <RangePicker
                          name={t('MEDIA_FRECUENCIA.FRECUENCIA') + " 2"}
                          variable={log.params[idx].params.frecuenciaPortadora2}
                          setVariable={() => {}}
                          min={mediafrecuencia.FRECUENCIAPORTADORA.min}
                          max={mediafrecuencia.FRECUENCIAPORTADORA.max}
                          step={mediafrecuencia.FRECUENCIAPORTADORA.step}
                          unit='Hz'
                          disabled
                        />
                      }
                      <RangePicker
                        name={t('MEDIA_FRECUENCIA.FMA')}
                        variable={log.params[idx].params.frecuenciaMA}
                        setVariable={() => {}}
                        min={mediafrecuencia.FRECUENCIAMA.min}
                        max={mediafrecuencia.BARRIDO.max}
                        step={mediafrecuencia.FRECUENCIAMA.step}
                        disabled
                        unit='Hz'
                      />

                      {log.params[idx].params.barrido &&
                        <BarridoPicker
                          name={t('MEDIA_FRECUENCIA.BARRIDO')}
                          variable={log.params[idx].params.barrido}
                          setVariable={() => {}}
                          midValue={log.params[idx].params.frecuenciaMA}
                          min={mediafrecuencia.BARRIDO.min}
                          max={mediafrecuencia.BARRIDO.max}
                          step={mediafrecuencia.FRECUENCIAMA.step}
                          disabled
                        />
                      }

                      {log.params[idx].params.contorno &&
                        <div style={{display: "flex"}}>
                          <ListPicker
                            variable={log.params[idx].params.contorno}
                            onChange={() => {}}
                            label={t('MEDIA_FRECUENCIA.CONTORNOS.LABEL')}
                            placeholder={t('MEDIA_FRECUENCIA.CONTORNOS.PH')}
                            valueOptions={contMediaOptions}
                            disabled
                          />
                          {log.params[idx].params.contorno == mediafrecuencia.CONTORNOS.C_1_1 && <IonIcon className='icono-contorno' src={icon_1_1} />}
                          {log.params[idx].params.contorno == mediafrecuencia.CONTORNOS.C_6_6 && <IonIcon className='icono-contorno' src={icon_6_6} />}
                          {log.params[idx].params.contorno == mediafrecuencia.CONTORNOS.C_1_30_1_30 && <IonIcon className='icono-contorno' src={icon_1_30_1_30} />}
                          {log.params[idx].params.contorno == mediafrecuencia.CONTORNOS.C_1_5_1_5 && <IonIcon className='icono-contorno' src={icon_1_5_1_5} />}
                          {log.params[idx].params.contorno == mediafrecuencia.CONTORNOS.C_12_12 && <IonIcon className='icono-contorno' src={icon_12_12} />}
                        </div>
                      }

                      {log.params[idx].params.contornoPersonalizado &&
                        <ListPicker
                          variable={log.params[idx].params.contornoPersonalizado}
                          onChange={() => {}}
                          label={t('MEDIA_FRECUENCIA.CONTORNOS_PERSONALIZADO.LABEL')}
                          placeholder={t('MEDIA_FRECUENCIA.CONTORNOS_PERSONALIZADO.PH')}
                          valueOptions={contPersMediaOptions}
                          disabled
                        />
                      }

                      {log.params[idx].params.vector &&
                        <ListPicker
                          variable={log.params[idx].params.vector}
                          onChange={() => {}}
                          label={t('MEDIA_FRECUENCIA.VECTOR.LABEL')} 
                          placeholder={t('MEDIA_FRECUENCIA.VECTOR.PH')} 
                          valueOptions={vecMediaOptions}
                          disabled
                        />
                      }

                    </>
                  }
                  {log.simulator == Simuladores.DIATERMIA &&
                    <>
                      <RangePicker
                        name={t('DIATERMIA.POTENCIA')}
                        variable={log.params[idx].params.potencia}
                        setVariable={() => {}}
                        min={diatermia.POTENCIA.min}
                        max={diatermia.POTENCIA.max}
                        step={diatermia.POTENCIA.step}
                        unit='W'
                        disabled
                      />
                      <ListPicker
                        variable={log.params[idx].params.emision}
                        onChange={() => {}}
                        label={t('DIATERMIA.EMISION.LABEL')}
                        placeholder={t('DIATERMIA.EMISION.PH')}
                        valueOptions={emiDiatermiaOptions}
                        disabled
                      />
                      <ListPicker
                        variable={log.params[idx].params.dutyCycle}
                        onChange={() => {}}
                        label={t('DIATERMIA.DUTY_CYCLE.LABEL')}
                        placeholder={t('DIATERMIA.DUTY_CYCLE.PH')}
                        valueOptions={dutyDiatermiaOptions}
                        disabled
                      />
                    </>
                  }
                  {log.simulator == Simuladores.ONDACORTA &&
                    <>
                      <RangePicker
                        name={t('ONDA_CORTA.POTENCIA')}
                        variable={log.params[idx].params.potencia}
                        setVariable={() => {}}
                        min={onda_corta.POTENCIA.min}
                        max={onda_corta.POTENCIA.max}
                        step={onda_corta.POTENCIA.step}
                        unit='W'
                        disabled
                      />
                      <ListPicker
                        variable={log.params[idx].params.emision}
                        onChange={() => {}}
                        label={t('ONDA_CORTA.EMISION.LABEL')}
                        placeholder={t('ONDA_CORTA.EMISION.PH')}
                        valueOptions={emiOndaCortaOptions}
                        disabled
                      />
                      <ListPicker
                        variable={log.params[idx].params.dutyCycle}
                        onChange={() => {}}
                        label={t('ONDA_CORTA.DUTY_CYCLE.LABEL')}
                        placeholder={t('ONDA_CORTA.DUTY_CYCLE.PH')}
                        valueOptions={dutyOndaCortaOptions}
                        disabled
                      />
                      <RangePicker
                        name={t('ONDA_CORTA.DISTANCIA')}
                        variable={log.params[idx].params.distancia}
                        setVariable={() => {}}
                        min={onda_corta.DISTANCIA.min}
                        max={onda_corta.DISTANCIA.max}
                        step={onda_corta.DISTANCIA.step}
                        unit='cm'
                        disabled
                      />
                    </>
                  }
                  {log.simulator == Simuladores.MICROONDAS &&
                    <>
                      <RangePicker
                        name={t('MICROONDAS.POTENCIA')}
                        variable={log.params[idx].params.potencia}
                        setVariable={() => {}}
                        min={onda_corta.POTENCIA.min}
                        max={onda_corta.POTENCIA.max}
                        step={onda_corta.POTENCIA.step}
                        unit='W'
                        disabled
                      />
                  
                      {/* Modo de emisión */}
                      <ListPicker
                        variable={log.params[idx].params.emision}
                        onChange={() => {}}
                        label={t('MICROONDAS.EMISION.LABEL')}
                        placeholder={t('MICROONDAS.EMISION.PH')}
                        valueOptions={emiMicroondasOptions}
                        disabled
                      />

                      {/* Relación de pulso / Duty Cycle */}
                      <ListPicker
                        variable={log.params[idx].params.dutyCycle}
                        onChange={() => {}}
                        label={t('MICROONDAS.DUTY_CYCLE.LABEL')}
                        placeholder={t('MICROONDAS.DUTY_CYCLE.PH')}
                        valueOptions={dutyMicroondasOptions}
                        disabled
                      />
                    </>
                  }
                  {log.simulator == Simuladores.INFRARROJOS &&
                    <>
                      <RangePicker
                        name={t('INFRARROJOS.POTENCIA')}
                        variable={log.params[idx].params.potencia}
                        setVariable={() => {}}
                        min={0}
                        max={1000}
                        step={10}
                        disabled
                        unit='W'
                      />
                      <RangePicker
                        name={t('INFRARROJOS.DISTANCIA')}
                        variable={log.params[idx].params.distancia}
                        setVariable={() => {}}
                        min={infrarrojos.DISTANCIA.min}
                        max={infrarrojos.DISTANCIA.max}
                        step={infrarrojos.DISTANCIA.step}
                        unit='cm'
                        disabled
                      />
                    </>
                  }
                  {log.simulator == Simuladores.LASER &&
                    <>
                      <RangePicker
                        name={t('LASER.POTENCIA.LABEL')}
                        variable={log.params[idx].params.potencia}
                        setVariable={() => {}}
                        min={0}
                        max={3000}
                        step={1}
                        disabled
                        unit={`${log.fixedParams.tipo == laser.TIPOS.L_LLLT ? 'mW' : 'W'}`}
                      />
                      <ListPicker
                        variable={log.params[idx].params.emision}
                        onChange={() => {}}
                        label={t('LASER.EMISION.LABEL')}
                        placeholder={t('LASER.EMISION.PH')}
                        valueOptions={emiLaserOptions}
                        disabled
                      />

                      {/* Frecuencia de pulso */}
                      {log.params[idx].params.frecuenciaPulso &&
                        <RangePicker
                          name={t('LASER.FRECUENCIA')}
                          variable={log.params[idx].params.frecuenciaPulso}
                          setVariable={() => {}}
                          min={0}
                          max={20000}
                          step={10}
                          disabled
                          unit='Hz'
                        />
                      }
                    </>
                  }
                  {log.simulator == Simuladores.ULTRAVIOLETAS &&
                    <RangePicker
                      name={t('ULTRAVIOLETAS.DISTANCIA.LABEL')}
                      variable={log.params[idx].params.distancia}
                      setVariable={() => {}}
                      min={ultravioletas.DISTANCIA.min}
                      max={ultravioletas.DISTANCIA.max}
                      step={ultravioletas.DISTANCIA.step}
                      unit='cm'
                      disabled
                    />
                  }
                  {log.simulator == Simuladores.MAGNETOTERAPIA &&
                    <>
                      <RangePicker
                        name={t('MAGNETOTERAPIA.INTENSIDAD')}
                        variable={log.params[idx].params.intensidad}
                        setVariable={() => {}}
                        min={log.fixedParams.tipo == null ? 0 : magnetoterapia.INTENSIDADES[log.fixedParams.tipo].min}
                        max={log.fixedParams.tipo == null ? 0 : magnetoterapia.INTENSIDADES[log.fixedParams.tipo].max}
                        step={log.fixedParams.tipo == null ? 0 : magnetoterapia.INTENSIDADES[log.fixedParams.tipo].step}
                        unit={`${log.fixedParams.tipo == magnetoterapia.TIPOS.SUPERINDUCTIVO ? 'Teslas' : 'Gauss'}`}
                        disabled
                      />
                      <ListPicker
                        variable={log.params[idx].params.emision}
                        onChange={() => {}}
                        label={t('MAGNETOTERAPIA.EMISION.LABEL')}
                        placeholder={t('MAGNETOTERAPIA.EMISION.PH')}
                        valueOptions={emiMagneOptions}
                        disabled
                      />
                      {log.params[idx].params.frecuencia &&
                        <RangePicker
                          name={t('MAGNETOTERAPIA.FRECUENCIA')}
                          variable={log.params[idx].params.frecuencia}
                          setVariable={() => {}}
                          min={magnetoterapia.FRECUENCIA.min}
                          max={magnetoterapia.FRECUENCIA.max}
                          step={magnetoterapia.FRECUENCIA.step}
                          unit='Hz'
                          disabled
                        />
                      }
                      {log.params[idx].params.barrido &&
                        <BarridoPicker
                          name={t('MAGNETOTERAPIA.BARRIDO')}
                          variable={log.params[idx].params.barrido}
                          setVariable={() => {}}
                          midValue={log.params[idx].params.frecuencia}
                          min={magnetoterapia.FRECUENCIA.min}
                          max={magnetoterapia.FRECUENCIA.max}
                          step={magnetoterapia.FRECUENCIA.step}
                          disabled
                        />
                      }
                    </>
                  }
                  {log.simulator == Simuladores.ULTRASONIDOS &&
                    <>
                      <RangePicker
                        name={t('ULTRASONIDOS.INTENSIDAD')}
                        variable={log.params[idx].params.intensidad}
                        setVariable={() => {}}
                        min={ultrasonidos.INTENSIDAD.min}
                        max={ultrasonidos.INTENSIDAD.max}
                        step={ultrasonidos.INTENSIDAD.step}
                        unit='W/cm²'
                        disabled
                      />
                      <ListPicker
                        variable={log.params[idx].params.emision}
                        onChange={() => {}}
                        label={t('ULTRASONIDOS.EMISION.LABEL')}
                        placeholder={t('ULTRASONIDOS.EMISION.PH')}
                        valueOptions={emiUSOptions}
                        disabled
                      />
                      <ListPicker
                        variable={log.params[idx].params.relacion}
                        onChange={() => {}}
                        label={t('ULTRASONIDOS.RELACION.LABEL')}
                        placeholder={t('ULTRASONIDOS.RELACION.PH')}
                        valueOptions={relUSOptions}
                        disabled
                      />
                    </>
                  }
                  {log.simulator == Simuladores.ONDASCHOQUE &&
                    <>
                      <RangePicker
                        name={t('ONDAS_CHOQUE.FRECUENCIA')}
                        variable={log.params[idx].params.frecuencia}
                        setVariable={() => {}}
                        min={log.fixedParams.tipo == null ? 0 : ondaschoque.FRECUENCIA[log.fixedParams.tipo].min}
                        max={log.fixedParams.tipo == null ? 0 : ondaschoque.FRECUENCIA[log.fixedParams.tipo].max}
                        step={log.fixedParams.tipo == null ? 0 : ondaschoque.FRECUENCIA[log.fixedParams.tipo].step}
                        unit='Hz'
                        disabled
                      />

                      {/* Presión / Energía */}
                      <RangePicker
                        name={t('ONDAS_CHOQUE.PRESION')}
                        variable={log.params[idx].params.presion}
                        setVariable={() => {}}
                        min={log.fixedParams.tipo == null ? 0 : ondaschoque.PRESION[log.fixedParams.tipo].min}
                        max={log.fixedParams.tipo == null ? 0 : ondaschoque.PRESION[log.fixedParams.tipo].max}
                        step={log.fixedParams.tipo == null ? 0 : ondaschoque.PRESION[log.fixedParams.tipo].step}
                        unit={`${log.fixedParams.tipo == ondaschoque.TIPO.RADIAL ? 'Bar' : 'mJ/mm²'}`}
                        disabled
                      />
                    </>
                  }
                </>
              }
            </div>
          ))}
        </>
      }
    </>
  );
};

export default VisualizadorVariables;