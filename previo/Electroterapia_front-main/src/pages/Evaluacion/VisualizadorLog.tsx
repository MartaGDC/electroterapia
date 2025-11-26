import './VisualizadorLog.css'

import { IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonMenuButton, IonModal, IonPage, IonRouterOutlet, IonRow, IonTabs, IonTitle, IonToolbar, useIonRouter, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageMapper from '../../components/ImageMapper/ImageMapper';
import constants from '../../constants/constants';
import { Redirect, useParams } from 'react-router';
import { getLogById } from '../../api/log';
import { IonReactRouter } from '@ionic/react-router';
import { caretDownOutline, caretForwardOutline } from 'ionicons/icons';
import VisualizadorMaterial from './VisualizadorMaterial';
import { Log, Simuladores } from '../../constants/interfaces';
import VisualizadorFijos from './VisualizadorFijos';
import VisualizadorVariables from './VisualizadorVariables';
import { useLog } from '../../context/logContext';
import VisualizadorMapper from '../../components/ImageMapper/VisualizadorMapper';
import { Electrodo } from '../../classes/Electrodos';
import { Aplicador } from '../../classes/Aplicadores';
import { AplicadorDiatermia, AplicadorInfrarrojos, AplicadorLaser, AplicadorMagnetoterapia, AplicadorMicroondas, AplicadorOndaCorta, AplicadorOndasChoque, AplicadorUltrasonidos, AplicadorUltravioletas } from '../../classes/TiposAplicadores';
import { establishMark } from '../../api/room';

const VisualizadorLog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [present] = useIonToast();
  const router = useIonRouter();

  const [isOpenEvaluar, setIsOpenEvaluar] = useState<boolean>(false);
  const [nota, setNota] = useState<number>(0);

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedParamIdx, setSelectedParamIdx] = useState<number | null>(null);

  const [log, setLog] = useState<Log | null>(null);

  const [electrodos, setElectrodos] = useState<any[]>([]);
  const [aplicadores, setAplicadores] = useState<any[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const lista = [
    { 
      name: t('VISUALIZADOR.MATERIALES'), 
      visualizador: () => <VisualizadorMaterial visible={selectedIdx == 0} log={log} /> 
    },
    { 
      name: t('VISUALIZADOR.FIJOS'),
      visualizador: () => <VisualizadorFijos visible={selectedIdx == 1} log={log} /> 
    },
    { 
      name: t('VISUALIZADOR.VARIABLES'),
      visualizador: () => 
        <VisualizadorVariables 
          visible={selectedIdx == 2} 
          log={log} 
          selectedParamIdx={selectedParamIdx} 
          setSelectedParamIdx={setSelectedParamIdx} 
        /> 
    },
  ];

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

  const evaluar = async () => {
    if (nota >= 0 && nota <= 10) {
      const res = await establishMark({logId: log?._id, mark: nota, roomId: log?.room});

      if (res.status == 200) {
        router.push("/app/salaProfesor/" + log?.room, "back", "pop");
        location.reload();
      }
    }
  }

  useEffect(() => {
    if (log !== null && selectedParamIdx !== null) {
      // Electrodos y aplicadores
      const elecOpts = [
        log.params[selectedParamIdx].params.anodoCanal1,
        log.params[selectedParamIdx].params.catodoCanal1,
        log.params[selectedParamIdx].params.anodoCanal2,
        log.params[selectedParamIdx].params.catodoCanal2,
      ]
      const elecArray: any[] = [];

      elecOpts.map((el) => {
        const e = constructElectrodo(el);
        if (e != null) elecArray.push(e)
      });
      setElectrodos(elecArray);

      const aplOpts = [
        log.params[selectedParamIdx].params.aplicador1,
        log.params[selectedParamIdx].params.aplicador2,
      ];
      const aplArray: any[] = [];

      aplOpts.map((el) => {
        const e = constructAplicador(el);
        if (e != null) aplArray.push(e)
      })
      setAplicadores(aplArray)

      setWidth(log.params[selectedParamIdx].params.width);
      setHeight(log.params[selectedParamIdx].params.height);
    }
  }, [log, selectedParamIdx]);

  useEffect(() => {
    const getLog = async () => {
      const res = await getLogById(id);

      if (res.status == 200) {
        console.log(res.data.log)
        setLog(res.data.log);
      }
    }

    getLog();
  }, []);

  return (
    <IonPage>
      <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end' />
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={constants.evaluacionIcon} />
            <IonTitle> {t('VISUALIZADOR.TITLE')} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className='content-sim'>
        <IonRow className="ion-justify-content-center ion-no-padding ion-no-margin">
          {/* Parte izquierda */}
          <IonCol size={constants.izqColSimulacion} className='izq-sim ion-padding ion-no-margin'>
            <IonContent>
              <IonButton onClick={() => setIsOpenEvaluar(true)} style={{width: "100%"}}>
                {t('ACTIVIDAD.EVALUAR.BUTTON')}
              </IonButton>

              <IonModal 
                isOpen={isOpenEvaluar} 
                onDidDismiss={() => setIsOpenEvaluar(false)}
              >
                <IonHeader>
                  <IonToolbar>
                    <IonTitle> {t('ACTIVIDAD.EVALUAR.BUTTON')} </IonTitle>
                    <IonButtons slot="end">
                      <IonButton strong={true} onClick={() => setIsOpenEvaluar(false)}> 
                        {t('ACTIVIDAD.EVALUAR.CANCELAR')} 
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                  {/* Nombre */}
                  <IonInput
                    type="number"
                    min={0}
                    max={10}
                    step={'0.1'} // si quieres permitir decimales como 7.5
                    value={nota}
                    label={t('ACTIVIDAD.EVALUAR.LABEL')}
                    labelPlacement='floating'
                    placeholder={t('ACTIVIDAD.EVALUAR.PH')}
                    onIonChange={(e) => {
                      const valor = parseFloat(e.detail.value!);
                      if (!isNaN(valor) && valor >= 1 && valor <= 10) {
                        setNota(valor);
                      } else if (e.detail.value === '') {
                        setNota(0);
                      }
                    }}
                  />
                  <IonButton className='button-crear-alumno' onClick={evaluar}>
                    {t('ACTIVIDAD.EVALUAR.EVALUAR')}
                  </IonButton>

                </IonContent>
              </IonModal>

              <IonList className='visualizador-list'>
                {lista.map((el, idx) => (
                  <div key={idx}>
                    <IonItem 
                      className='principal-items'
                      lines='full' 
                      onClick={() => setSelectedIdx(selectedIdx == idx ? null : idx)}
                    >
                      {el.name}
                      <IonIcon 
                        slot='end'
                        src={selectedIdx == idx ? caretDownOutline : caretForwardOutline}
                      />
                    </IonItem>
                    {el.visualizador()}
                  </div>
                ))}
              </IonList>
            </IonContent>
          </IonCol>
          {/* Parte derecha */}
          <IonCol size={constants.dchColSimulacion} className='cuerpo ion-no-padding ion-no-margin'>
            <IonContent>
              <VisualizadorMapper
                electrodos={electrodos}
                aplicadores={aplicadores}
                width={width}
                height={height}
              />
            </IonContent>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default VisualizadorLog;