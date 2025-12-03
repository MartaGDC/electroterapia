import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { allAplicadores, Aplicador, Aplicadores } from '../../classes/Aplicadores';
import { useTranslation } from 'react-i18next';
import ListPicker from '../Pickers/ListPicker';
import { valueOptions } from '../Logica/General';
import { electrodo_activo_bi, electrodo_activo_mo, electrodo_pasivo_bi, modos_diatermia } from '../../classes/Diatermia';
import { useLog } from '../../context/logContext';
import { AplicadorDiatermia, AplicadorInfrarrojos, AplicadorLaser, AplicadorMagnetoterapia, AplicadorMicroondas, AplicadorOndaCorta, AplicadorOndasChoque, AplicadorUltrasonidos, AplicadorUltravioletas } from '../../classes/TiposAplicadores';
import { useAplicador } from '../../context/aplicadorContext';
import { aplicadores } from '../../classes/MicroOndas';
import { aplicadores_HILT, aplicadores_LLLT, tipos } from '../../classes/Laser';
import { magnetoterapia } from '../../classes/Magnetoterapia';
import { ultrasonidos } from '../../classes/Ultrasonidos';
import { ondaschoque } from '../../classes/OndasChoque';
import { onda_corta } from '../../classes/OndaCorta';

const AplicadorSelector: React.FC = () => {
  const {aplicador1, setAplicador1, aplicador2, setAplicador2} = useLog();
  const {
    modoAplicador, setModoAplicador,
    activo, setActivo, pasivo, setPasivo,
    modoDiatermia, setModoDiatermia,
    modoOndaCorta, setModoOndaCorta,
    tipoLaser, setTipoLaser,
    tipoMagnetoterapia, setTipoMagnetoterapia,
    tipoOndasChoque, setTipoOndasChoque,
  } = useAplicador();
  const {t} = useTranslation();

  //////////////////////////////////////////////////////////////////////////////
  // Options para List Pickers
  //////////////////////////////////////////////////////////////////////////////
  const aplModoPickerOptions = valueOptions('MENU_MATERIALES.APLICADOR.OPCIONES_APLICADOR', t, allAplicadores, () => false);

  // Diatermia
  const diatermiaModosOptions = valueOptions('DIATERMIA.MODOS.OPCIONES', t, modos_diatermia.values, () => false);
  const actBiOptions = valueOptions('DIATERMIA.ELECTRODOS.OPCIONES_ACT_BI', t, electrodo_activo_bi.values, () => false);
  const actMoOptions = valueOptions('DIATERMIA.ELECTRODOS.OPCIONES_ACT_MO', t, electrodo_activo_mo.values, () => false);
  const pasOptions = valueOptions('DIATERMIA.ELECTRODOS.OPCIONES_PAS', t, electrodo_pasivo_bi.values, () => false);

  // Onda Corta
  const ondaCortaModoOptions = valueOptions('ONDA_CORTA.MODO.OPCIONES', t, onda_corta.MODOS.values, () => false);
  const ondaCortaAplOptions = valueOptions('ONDA_CORTA.ELECTRODOS.OPCIONES', t, onda_corta.ELECTRODOS.values, () => false);

  // Microondas
  const microondasOptions = valueOptions('MICROONDAS.APLICADOR.OPCIONES', t, aplicadores.values, () => false);

  // Laser
  const laserTiposOptions = valueOptions('LASER.TIPOS.OPCIONES', t, tipos.values, () => false);
  const laserLLLTOptions = valueOptions('LASER.APLICADOR.OPCIONES_LLLT', t, aplicadores_LLLT.values, () => false);
  const laserHILTOptions = valueOptions('LASER.APLICADOR.OPCIONES_HILT', t, aplicadores_HILT.values, () => false);

  // Magnetoterapia
  const magnTiposOptions = valueOptions('MAGNETOTERAPIA.TIPOS.OPCIONES', t, magnetoterapia.TIPOS.values, () => false);
  const magnConvOptions = valueOptions('MAGNETOTERAPIA.APLICADOR.OPCIONES_PBMF', t, magnetoterapia.APLICADORES.PBMF.values, () => false);
  const magnSisOptions = valueOptions('MAGNETOTERAPIA.APLICADOR.OPCIONES_SIS', t, magnetoterapia.APLICADORES.SIS.values, () => false);

  // Ultrasonidos
  const usOptions = valueOptions('ULTRASONIDOS.CABEZAL.OPCIONES', t, ultrasonidos.CABEZAL, () => false);

  // Ondas de choque
  const ondasChoqueTiposOptions = valueOptions('ONDAS_CHOQUE.TIPOS.OPCIONES', t, ondaschoque.TIPO.values, () => false);
  const ondasChoqueRadialOptions = valueOptions('ONDAS_CHOQUE.APLICADOR.OPCIONES_RADIAL', t, ondaschoque.APLICADOR.RADIAL.values, () => false);
  const ondasChoqueFocalOptions = valueOptions('ONDAS_CHOQUE.APLICADOR.OPCIONES_FOCAL', t, ondaschoque.APLICADOR.FOCAL.values, () => false);

  const toNull = () => {
    setActivo(null);
    setAplicador1(null);
    setPasivo(null);
    setAplicador2(null);
  }

  return (
    <div className="ion-padding-start">
      {/****************************************************************/}
      {/* Aplicador */}
      {/****************************************************************/}
      <h3 style={{display: "flex", fontWeight: "bold"}} className="ion-no-margin ion-margin-top ion-align-items-center">
        {t('MENU_MATERIALES.APLICADOR.LABEL')} 
      </h3>
      <ListPicker
        variable={modoAplicador}
        onChange={(e: any) => {
          setModoAplicador(e);
          toNull();
          if (e == Aplicadores.INFRARROJOS) setAplicador1(new Aplicador(50, 50, new AplicadorInfrarrojos()));
          else if (e == Aplicadores.ULTRAVIOLETAS) setAplicador1(new Aplicador(50, 50, new AplicadorUltravioletas()));
        }}
        label={t('MENU_MATERIALES.APLICADOR.LABEL')}
        placeholder={t('MENU_MATERIALES.APLICADOR.PH')}
        valueOptions={aplModoPickerOptions}
      />

      {modoAplicador == Aplicadores.DIATERMIA &&
        <div className="ion-padding-start">
          <ListPicker
            variable={modoDiatermia}
            onChange={(e: any) => {
              setModoDiatermia(e);
              toNull();
            }}
            label={t('DIATERMIA.TECNICAS.LABEL')}
            placeholder={t('DIATERMIA.TECNICAS.PH')}
            valueOptions={diatermiaModosOptions}
          />

          {modoDiatermia === modos_diatermia.BIPOLAR &&
            <div className="ion-padding-start">
              <ListPicker
                variable={activo}
                onChange={(e: any) => {
                  setActivo(e);
                  setAplicador1(
                    new Aplicador(50, 50, new AplicadorDiatermia("activo", "bipolar", e), "#ff0000")
                  );
                }}
                label={t(`DIATERMIA.ELECTRODOS.ACTIVO_BIPOLAR_CAPACITIVO.LABEL`)}
                placeholder={t('DIATERMIA.ELECTRODOS.PH')}
                valueOptions={actBiOptions}
              />
              
              <ListPicker
                variable={pasivo}
                onChange={(e: any) => {
                  setPasivo(e);
                  setAplicador2(
                    new Aplicador(50, 50, new AplicadorDiatermia("pasivo", "bipolar", e), "#000000")
                  );
                }}
                label={t('DIATERMIA.ELECTRODOS.PASIVO.LABEL')}
                placeholder={t('DIATERMIA.ELECTRODOS.PH')}
                valueOptions={pasOptions}
              />
            </div>
          }
          {modoDiatermia == modos_diatermia.MONOPOLAR &&
            <div className="ion-padding-start">
              <ListPicker
                variable={activo}
                onChange={(e: any) => {
                  setActivo(e);
                  setAplicador1(
                    new Aplicador(50, 50, new AplicadorDiatermia("activo", "monopolar", e), "#ff0000")
                  );
                }}
                label={t(`DIATERMIA.ELECTRODOS.ACTIVO_MONOPOLAR.LABEL`)}
                placeholder={t('DIATERMIA.ELECTRODOS.PH')}
                valueOptions={actMoOptions}
              />
            </div>
          }
        </div>
      }

      {modoAplicador == Aplicadores.ONDA_CORTA &&
        <div className="ion-padding-start">
          <ListPicker
            variable={modoOndaCorta}
            onChange={(e: any) => {
              toNull();
              setModoOndaCorta(e);

              if (e == onda_corta.MODOS.CAPACITIVO) {
                setActivo(0);
                setAplicador1(new Aplicador(50, 50, new AplicadorOndaCorta(0)));
                setPasivo(0);
                setAplicador2(new Aplicador(50, 50, new AplicadorOndaCorta(0)));
              } else if (e == onda_corta.MODOS.INDUCTIVO) {
                setActivo(1);
                setAplicador1(new Aplicador(50, 50, new AplicadorOndaCorta(1)));
              }
            }}
            label={t('ONDA_CORTA.MODO.LABEL')}
            placeholder={t('ONDA_CORTA.MODO.PH')}
            valueOptions={ondaCortaModoOptions}
          />

          {modoOndaCorta == onda_corta.MODOS.CAPACITIVO &&
            <div className='ion-padding-start'>
              <ListPicker
                variable={activo}
                onChange={setActivo}
                label={t('ONDA_CORTA.ELECTRODOS.1.CAPACITIVO.LABEL')}
                placeholder={t('ONDA_CORTA.ELECTRODOS.1.CAPACITIVO.PH')}
                valueOptions={ondaCortaAplOptions}
                disabled={true}
              />
              <ListPicker
                variable={pasivo}
                onChange={setPasivo}
                label={t('ONDA_CORTA.ELECTRODOS.2.LABEL')}
                placeholder={t('ONDA_CORTA.ELECTRODOS.2.PH')}
                valueOptions={ondaCortaAplOptions}
                disabled={true}
              />
            </div>
          }

          {modoOndaCorta == onda_corta.MODOS.INDUCTIVO &&
            <div className='ion-padding-start'>
              <ListPicker
                variable={activo}
                onChange={setActivo}
                label={t('ONDA_CORTA.ELECTRODOS.1.INDUCTIVO.LABEL')}
                placeholder={t('ONDA_CORTA.ELECTRODOS.1.INDUCTIVO.PH')}
                valueOptions={ondaCortaAplOptions}
                disabled={true}
              />
            </div>
          }
        </div>
      }

      {modoAplicador == Aplicadores.MICROONDAS &&
        <div className="ion-padding-start">
          <ListPicker
            variable={activo}
            onChange={(e: any) => {
              setActivo(e);
              setAplicador1(
                new Aplicador(50, 50, new AplicadorMicroondas(e))
              );
            }}
            label={t('MICROONDAS.APLICADOR.LABEL')}
            placeholder={t('MICROONDAS.APLICADOR.PH')}
            valueOptions={microondasOptions}
          />
        </div>
      }

      {modoAplicador == Aplicadores.LASER &&
        <div className="ion-padding-start">
          <ListPicker
            variable={tipoLaser}
            onChange={(e: any) => {
              setTipoLaser(e);
              toNull();
            }}
            label={t('LASER.TIPOS.LABEL')}
            placeholder={t('LASER.TIPOS.PH')}
            valueOptions={laserTiposOptions}
          />

          {tipoLaser !== null &&
            <div className='ion-padding-start'>
              <ListPicker
                variable={activo}
                onChange={(e: any) => {
                  setActivo(e);
                  if (tipoLaser == tipos.L_LLLT) {
                    setAplicador1(new Aplicador(50, 50, new AplicadorLaser(0, e)));
                  } else if (tipoLaser == tipos.L_HILT) {
                    setAplicador1(new Aplicador(50, 50, new AplicadorLaser(1, e)));
                  }
                }}
                label={t('LASER.APLICADOR.LABEL')}
                placeholder={t('LASER.APLICADOR.PH')}
                valueOptions={tipoLaser == tipos.L_LLLT ? laserLLLTOptions : laserHILTOptions}
              />
            </div>
          }
        </div>
      }

      {modoAplicador == Aplicadores.MAGNETOTERAPIA &&
        <div className="ion-padding-start">
          <ListPicker
            variable={tipoMagnetoterapia}
            onChange={(e: any) => {
              setTipoMagnetoterapia(e);
              toNull();
            }}
            label={t('MAGNETOTERAPIA.TIPOS.LABEL')}
            placeholder={t('MAGNETOTERAPIA.TIPOS.PH')}
            valueOptions={magnTiposOptions}
          />

          {tipoMagnetoterapia !== null &&
            <div className='ion-padding-start'>
              <ListPicker
                variable={activo}
                onChange={(e: any) => {
                  setActivo(e);
                  if (tipoMagnetoterapia == magnetoterapia.TIPOS.CONVENCIONAL) {
                    setAplicador1(new Aplicador(50, 50, new AplicadorMagnetoterapia("convencional", e)));
                  } else if (tipoMagnetoterapia == magnetoterapia.TIPOS.SUPERINDUCTIVO) {
                    setAplicador1(new Aplicador(50, 50, new AplicadorMagnetoterapia("superinductiva", e)));
                  }
                }}
                label={t('MAGNETOTERAPIA.APLICADOR.LABEL')}
                placeholder={t('MAGNETOTERAPIA.APLICADOR.PH')}
                valueOptions={
                  tipoMagnetoterapia == magnetoterapia.TIPOS.CONVENCIONAL
                    ? magnConvOptions
                    : magnSisOptions
                }
              />
            </div>
          }
        </div>
      }

      {modoAplicador == Aplicadores.ULTRASONIDOS &&
        <div className='ion-padding-start'>
          <ListPicker
            variable={activo}
            onChange={(e: any) => {
              setActivo(e);
              setAplicador1(new Aplicador(50, 50, new AplicadorUltrasonidos(e)));
            }}
            label={t('ULTRASONIDOS.CABEZAL.LABEL')}
            placeholder={t('ULTRASONIDOS.CABEZAL.PH')}
            valueOptions={usOptions}
          />
        </div>
      }

      {modoAplicador == Aplicadores.ONDAS_CHOQUE &&
        <div className='ion-padding-start'>
          <ListPicker
            variable={tipoOndasChoque}
            onChange={(e: any) => {
              toNull();
              setTipoOndasChoque(e);
            }}
            label={t('ONDAS_CHOQUE.TIPOS.LABEL')}
            placeholder={t('ONDAS_CHOQUE.TIPOS.PH')}
            valueOptions={ondasChoqueTiposOptions}
          />

          {tipoOndasChoque !== null &&
            <div className='ion-padding-start'>
              <ListPicker
                variable={activo}
                onChange={(e: any) => {
                  setActivo(e);
                  if (tipoOndasChoque == ondaschoque.TIPO.RADIAL) {
                    setAplicador1(new Aplicador(50, 50, new AplicadorOndasChoque("rswt", e)));
                  } else if (tipoOndasChoque == ondaschoque.TIPO.FOCAL) {
                    setAplicador1(new Aplicador(50, 50, new AplicadorOndasChoque("fswt", e)));
                  }
                }}
                label={t('ONDAS_CHOQUE.APLICADOR.LABEL')}
                placeholder={t('ONDAS_CHOQUE.APLICADOR.PH')}
                valueOptions={tipoOndasChoque == ondaschoque.TIPO.RADIAL
                  ? ondasChoqueRadialOptions
                  : ondasChoqueFocalOptions
                }
              />
            </div>
          }
        </div>
      }

    </div>
  );
};

export default AplicadorSelector;