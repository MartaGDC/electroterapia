import React, { useState } from 'react';
import { Log, Simuladores, Time } from '../../constants/interfaces';
import { useTranslation } from 'react-i18next';
import ListPicker from '../../components/Pickers/ListPicker';
import { valueOptions } from '../../components/Logica/General';
import TimePicker from '../../components/Pickers/TimePicker';
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

const VisualizadorFijos: React.FC<{
  log: Log | null;
  visible: boolean;
}> = ({
  log, visible
}) => {
  const {t} = useTranslation();

  const [timeFalso, setTimeFalso] = useState<Time>(new Time(0,0));

  // Options
  const modoOndaCortaOptions = valueOptions('ONDA_CORTA.MODO.OPCIONES', t, onda_corta.MODOS.values, () => false);
  const equiIROptions = valueOptions('INFRARROJOS.EQUIPO.OPCIONES', t, infrarrojos.EQUIPOS.values, () => false);
  const tiposLaserOptions = valueOptions('LASER.TIPOS.OPCIONES', t, laser.TIPOS.values, () => false);
  const longLaserOptions = valueOptions('LASER.LONGITUD_ONDA.OPCIONES', t, laser.LONGITUDESONDA.values, () => false);
  const equiUVOptions = valueOptions('ULTRAVIOLETAS.EQUIPO.OPCIONES', t, ultravioletas.TIPO_RADIACION.values, () => false);
  const tipoMGOptions = valueOptions('MAGNETOTERAPIA.TIPOS.OPCIONES', t, magnetoterapia.TIPOS.values, () => false);
  const frecUSOptions = valueOptions('ULTRASONIDOS.FRECUENCIA.OPCIONES', t, ultrasonidos.CONDUCCION, () => false);
  const tipoOndaChoqueOptions = valueOptions('ONDAS_CHOQUE.TIPOS.OPCIONES', t, ondaschoque.TIPO.values, () => false);

  return (
    <>
      {visible && log &&
        <>
          <TimePicker
            variable={new Time(log.fixedParams.tratamiento.minutes, log.fixedParams.tratamiento.seconds)}
            setVariable={setTimeFalso}
            disabled
          />

          {log.simulator == Simuladores.GALVANICA &&
            <TimePicker
              variable={new Time(log.fixedParams.rampa.minutes, log.fixedParams.rampa.seconds)}
              setVariable={setTimeFalso}
              disabled
              labelText={t('GALVANICA.RAMPA')}
            />
          }
          {log.simulator == Simuladores.DIATERMIA &&
            <RangePicker
              name={t('DIATERMIA.FRECUENCIA')}
              variable={log.fixedParams.frecuencia}
              setVariable={() => {}}
              min={diatermia.FRECUENCIA.min}
              max={diatermia.FRECUENCIA.max}
              step={diatermia.FRECUENCIA.step}
              unit='MHz'
              disabled
            />
          }
          {log.simulator == Simuladores.ONDACORTA &&
            <>
              <ListPicker
                variable={log.fixedParams.modo}
                onChange={() => {}}
                label={t('ONDA_CORTA.MODO.LABEL')}
                placeholder={t('ONDA_CORTA.MODO.PH')}
                valueOptions={modoOndaCortaOptions}
                disabled
              />
              <RangePicker
                name={t('ONDA_CORTA.FRECUENCIA')}
                variable={onda_corta.FRECUENCIA.value}
                setVariable={() => {}}
                min={onda_corta.FRECUENCIA.min}
                max={onda_corta.FRECUENCIA.max}
                step={onda_corta.FRECUENCIA.step}
                disabled
                unit='MHz'
              />

            </>
          }
          {log.simulator == Simuladores.MICROONDAS &&
            <>
              <RangePicker
                name={t('MICROONDAS.FRECUENCIA')}
                variable={log.fixedParams.frecuencia}
                setVariable={() => {}} // Nunca se usa
                min={0}
                max={100}
                step={1}
                disabled
                unit='GHz'
              />
              <RangePicker
                name={t('MICROONDAS.DISTANCIA')}
                variable={log.fixedParams.distancia}
                setVariable={() => {}}
                min={microondas.DISTANCIA.min}
                max={microondas.DISTANCIA.max}
                step={microondas.DISTANCIA.step}
                unit='cm'
                disabled
              />
            </>
          }
          {log.simulator == Simuladores.INFRARROJOS &&
            <ListPicker
              variable={log.fixedParams.equipo}
              onChange={() => {}}
              label={t('INFRARROJOS.EQUIPO.LABEL')}
              placeholder={t('INFRARROJOS.EQUIPO.PH')}
              valueOptions={equiIROptions}
              disabled
            />
          }
          {log.simulator == Simuladores.LASER &&
            <>
              <ListPicker
                variable={log.fixedParams.tipo}
                onChange={() => {}}
                label={t('LASER.TIPOS.LABEL')}
                placeholder={t('LASER.TIPOS.PH')}
                valueOptions={tiposLaserOptions}
                disabled
              />
              <ListPicker
                variable={log.fixedParams.longitudOnda}
                onChange={() => {}}
                label={t('LASER.LONGITUD_ONDA.LABEL')}
                placeholder={t('LASER.LONGITUD_ONDA.PH')}
                valueOptions={longLaserOptions}
                disabled
              />
              <RangePicker
                name={t('LASER.SUPERFICIE_TRATADA')}
                variable={log.fixedParams.superficie}
                setVariable={() => {}}
                min={laser.SUPERFICIE_TRATADA.min}
                max={laser.SUPERFICIE_TRATADA.max}
                step={laser.SUPERFICIE_TRATADA.step}
                unit='cm²'
                disabled
              />
              <RangePicker
                name={t('LASER.DOSIS.LABEL')}
                variable={log.fixedParams.dosis}
                setVariable={() => {}}
                min={laser.DOSIS_TOTAL.min}
                max={laser.DOSIS_TOTAL.max}
                step={laser.DOSIS_TOTAL.step}
                unit='J/cm²'
              />
            </>
          }
          {log.simulator == Simuladores.ULTRAVIOLETAS &&
            <>
              <ListPicker
                variable={log.fixedParams.tipo}
                onChange={() => {}}
                label={t('ULTRAVIOLETAS.EQUIPO.LABEL')}
                placeholder={t('ULTRAVIOLETAS.EQUIPO.PH')}
                valueOptions={equiUVOptions}
                disabled
              />
              <RangePicker
                name={t('ULTRAVIOLETAS.DOSIS.LABEL')}
                variable={log.fixedParams.radiacion}
                setVariable={() => {}}
                min={ultravioletas.RADIACION.min}
                max={ultravioletas.RADIACION.max}
                step={ultravioletas.RADIACION.step}
                unit='J/cm²'
                disabled
              />
              <RangePicker
                name={t('ULTRAVIOLETAS.IRRADIANCIA')}
                variable={log.fixedParams.irradiancia}
                setVariable={() => {}}
                min={1}
                max={5}
                step={0.5}
                disabled={true}
                unit='mW/cm²'
              />
            </>
          }
          {log.simulator == Simuladores.MAGNETOTERAPIA &&
            <>
              <ListPicker
                variable={log.fixedParams.tipo}
                onChange={() => {}}
                label={t('MAGNETOTERAPIA.TIPOS.LABEL')}
                placeholder={t('MAGNETOTERAPIA.TIPOS.PH')}
                valueOptions={tipoMGOptions}
                disabled
              />
              <RangePicker
                name={t('MAGNETOTERAPIA.DISTANCIA')}
                variable={log.fixedParams.distancia}
                setVariable={() => {}}
                min={magnetoterapia.DISTANCIA.min}
                max={magnetoterapia.DISTANCIA.max}
                step={magnetoterapia.DISTANCIA.step}
                unit='cm'
                disabled
              />
            </>
          }
          {log.simulator == Simuladores.ULTRASONIDOS &&
            <>
              <ListPicker
                variable={log.fixedParams.frecuencia}
                onChange={() => {}}
                label={t('ULTRASONIDOS.FRECUENCIA.FRECUENCIA')}
                placeholder={t('ULTRASONIDOS.FRECUENCIA.PH')}
                valueOptions={frecUSOptions}
                disabled
              />
              <RangePicker
                name={t('ULTRASONIDOS.DOSIS_TOTAL')}
                variable={log.fixedParams.dosisTotal}
                setVariable={() => {}}
                min={ultrasonidos.DOSIS_TOTAL.min}
                max={ultrasonidos.DOSIS_TOTAL.max}
                step={ultrasonidos.DOSIS_TOTAL.step}
                unit='J'
                disabled
              />
              <RangePicker
                name={t('ULTRASONIDOS.SUPERFICIE_TRATADA')}
                variable={log.fixedParams.superficie}
                setVariable={() => {}}
                min={ultrasonidos.SUPERFICIE.min}
                max={ultrasonidos.SUPERFICIE.max}
                step={ultrasonidos.SUPERFICIE.step}
                unit='cm²'
                disabled
              />
              <RangePicker
                name={t('ULTRASONIDOS.DOSIS.LABEL')}
                variable={log.fixedParams.dosisPorCm}
                setVariable={() => {}}
                min={ultrasonidos.SUPERFICIE_CM.min}
                max={ultrasonidos.SUPERFICIE_CM.max}
                step={ultrasonidos.SUPERFICIE_CM.step}
                unit='cm²'
                disabled
              />
            </>
          }
          {log.simulator == Simuladores.ONDASCHOQUE &&
            <>
              <ListPicker
                variable={log.fixedParams.tipo}
                onChange={() => {}}
                label={t('ONDAS_CHOQUE.TIPOS.LABEL')}
                placeholder={t('ONDAS_CHOQUE.TIPOS.PH')}
                valueOptions={tipoOndaChoqueOptions}
                disabled
              />
              <RangePicker
                name={t('ONDAS_CHOQUE.IMPACTOS.LABEL')}
                variable={log.fixedParams.impactos}
                setVariable={() => {}}
                min={ondaschoque.IMPACTOS.min}
                max={ondaschoque.IMPACTOS.max}
                step={ondaschoque.IMPACTOS.step}
                disabled
                unit='imp.'
              />
              <RangePicker
                name={t('ONDAS_CHOQUE.DOSIS.LABEL')}
                variable={log.fixedParams.dosisTotal}
                setVariable={() => {}}
                min={ondaschoque.DOSIS.min}
                max={ondaschoque.DOSIS.max}
                step={ondaschoque.DOSIS.step}
                unit={log.fixedParams.tipo == ondaschoque.TIPO.FOCAL ? 'mJ/mm²' 
                  : log.fixedParams.tipo == ondaschoque.TIPO.RADIAL ? "imp.×Bar" : ""}
                disabled
              />

            </>
          }
        </>
      }
    </>
  );
};

export default VisualizadorFijos;