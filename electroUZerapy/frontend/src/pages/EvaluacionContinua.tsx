import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonMenuButton, IonModal, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './EvaluacionContinua.css'
import constants from '../constants/constants';
import { List, Test, Tema } from '../constants/interfaces';
import { getAllLists } from '../api/list';
import { createNewTest, getAllTests, getAllTemas } from '../api/test';

import QRClass from "./Continua/QRClass";



const Continua: React.FC = () => {
  const {t} = useTranslation();
  const router = useIonRouter();

  const [listados, setListados] = useState<List[]>([]);
  const [qrListaVisible, setQrListaVisible] = useState(false);
  const [temas, setTemas] = useState<Tema[]>([]);
  const [temasVisible, setTemasVisible] = useState(false);
  const [qrTestVisible, setQrTestVisible] = useState(false);
  const [qrTest, setQrTest] = useState<string>('');

  const [tests, setTests] = useState<Test[]>([]);

  const navigateListado = (codeQr: string) => {
    event?.preventDefault();
    router.push(`/app/salaListados/${codeQr}`, 'root', 'replace');
  }
  
  const navigateTest = (testId: string) => {
    event?.preventDefault();
    router.push(`/app/salaTests/${testId}`, 'root', 'replace');
  }

  const verAsistencias = () => {
    router.push('/app/asistencia', 'root', 'replace');
  }
  
  const verNotas = () => {
    router.push('/app/notas', 'root', 'replace');
  }

  const getListados = async () => {
    const res = await getAllLists();
    if (res.status == 200) {
      setListados(res.data.lists);
    }
  };
  const getTests = async () => {
    const res = await getAllTests();
    if (res.status == 200) {
      setTests(res.data.tests);
    }
  };

  useEffect(() => {
    getListados();
    getTests();
  }, [qrListaVisible]);

  useEffect(() => {
    if (temasVisible) {
      const getTemas = async () => {
        const res = await getAllTemas();
        if (res.status == 200) {
          setTemas(res.data.temas);
        }
      };
      getTemas();
    }
  }, [temasVisible]);

  const crearNuevoTest = async (idTema:string) => {
    const res = await createNewTest({idTema: idTema});
    setQrTest(res.data.code);
    setQrTestVisible(true);
    getTests();
  }
  
  const cerrarTemas = () => {
    setTemasVisible(false);
  }

  return (
    <IonPage>
      <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={constants.continuaIcon}/>
            <IonTitle> {t("MENU.CONTINUA")} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding' fullscreen>
        <IonGrid>
          <IonRow className='ion-align-items-center'>
            <IonCol size='3'>
              <h2 className='ion-margin-top ion-margin-start ion-margin-end ion-no-margin ion-padding-end'>{t("CONTINUA.LISTAS")}</h2>
            </IonCol>
            <IonCol size='1'>
              <IonFabButton onClick={() => verAsistencias()} className='ion-margin-top ion-margin-start ion-margin-end ion-no-margin'>
                <IonIcon src={constants.verIcon} size='large' />
              </IonFabButton>
            </IonCol>
            <IonCol size='2'>
              <IonFabButton onClick={() => setQrListaVisible(true)} color={'dark'} className='ion-margin-top ion-margin-start ion-no-margin'>
                <IonIcon icon={add} ></IonIcon>
              </IonFabButton>
            </IonCol>
          </IonRow>
        </IonGrid>
          
        <QRClass
          isVisible={qrListaVisible}
          setIsVisible={setQrListaVisible}
          value='lista'
        />

        <div className='lista-list-container'>
          <ul className='ion-no-padding ion-no-margin'>
            {listados.map((list, idx) => (
              <li className='ion-no-margin' key={idx}>
                <IonCard className='ion-no-margin' onClick={() => navigateListado(list.codigo)}>
                  <IonCardHeader className='ion-no-padding'>
                    <div className='ion-padding-end' style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <IonCardTitle className='ion-no-margin ion-text-start'>
                        {new Date(list.start).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                        })}
                      </IonCardTitle>
                    </div>
                    {list.isOpen ? (
                      <IonCardSubtitle style={{fontWeight: "bold", opacity: "1", color: "var(--ion-color-naranja)"}}>
                        {t('CONTINUA.ESTADO.ABIERTO')}
                      </IonCardSubtitle>
                    ) : (
                      <IonCardSubtitle style={{fontWeight: "bold"}}>
                        {t('CONTINUA.ESTADO.CERRADO')}
                      </IonCardSubtitle>
                    )}
                  </IonCardHeader>
                  <IonCardContent className='ion-margin-start'>
                    <div className='ion-margin-start' style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      {list.asistentes.length}
                    </div>
                  </IonCardContent>                
                </IonCard>
              </li>
            ))}
          </ul>
        </div>

        <div className="lista-student-container ion-margin"></div>
        <div className="lista-student-container ion-margin"></div>
        <IonGrid>
          <IonRow className='ion-align-items-center'>
            <IonCol size='3'>
              <h2 className='ion-margin-top ion-margin-start ion-margin-end ion-no-margin ion-padding-end'>{t("CONTINUA.KAHOOT")}</h2>
            </IonCol>
            <IonCol size='1'>
              <IonFabButton onClick={() => verNotas()} className='ion-margin-top ion-margin-start ion-margin-end ion-no-margin'>
                <IonIcon src={constants.verIcon} size='large' />
              </IonFabButton>
            </IonCol>
            <IonCol size='2'>
              <IonFabButton onClick={() => setTemasVisible(true)} color={'dark'} className='ion-margin-top ion-margin-start ion-no-margin'>
                <IonIcon icon={add} ></IonIcon>
              </IonFabButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonModal isOpen={temasVisible} onIonModalDidDismiss={cerrarTemas}>
          <IonContent className='ion-padding'>
            <h2 className='ion-padding ion-text-center'>{t("CONTINUA.TEMA")}</h2>
            <ul className='ion-no-padding ion-margin'>
              {temas.map((tema) => (
                <li className='ion-no-margin' style={{cursor: 'pointer'}} key={tema._id}>
                  <IonCard className='ion-no-margin' onClick={() => {
                    crearNuevoTest(tema._id);
                    setTemasVisible(false);
                  }}>
                    <IonCardHeader className='ion-no-padding'>
                      <IonCardTitle className='ion-margin'style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        {tema.nombre}
                      </IonCardTitle>
                    </IonCardHeader>
                  </IonCard>
                </li>
              ))}
            </ul>
          </IonContent>
        </IonModal>
        <QRClass
          isVisible={qrTestVisible}
          setIsVisible={setQrTestVisible}
          value='test'
          code={qrTest}
        />
        <div className='lista-list-container'>
          <ul className='ion-no-padding ion-no-margin'>
            {tests.map((test, idx) => (
            <li className='ion-no-margin' key={idx}>
              <IonCard className='ion-no-margin' onClick={() => navigateTest(test._id)}>
                <IonCardHeader className='ion-no-padding'>
                  <div 
                    className='ion-padding-end'
                    style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                  >
                    <IonCardTitle className='ion-no-margin ion-text-start'>
                      {new Date(test.start).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </IonCardTitle>
                  </div>
                  {test.isOpen ? (
                    <IonCardSubtitle style={{fontWeight: "bold", opacity: "1", color: "var(--ion-color-naranja)"}}>
                      {t('CONTINUA.ESTADO.ABIERTO')}
                    </IonCardSubtitle>
                  ) : (
                    <IonCardSubtitle style={{fontWeight: "bold"}}>
                      {t('CONTINUA.ESTADO.CERRADO')}
                    </IonCardSubtitle>
                  )}
                </IonCardHeader>
                <IonCardContent className='ion-margin-start'>
                  <div 
                    className='ion-margin-start'
                    style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                  >
                    {/*{testCorregido.alumnos.length ? testCorregido.alumnos.length : 0}*/}
                    
                  </div>
                </IonCardContent>                
              </IonCard>
            </li>
            ))}
          </ul>
        </div>

        
      </IonContent>
    </IonPage>
  );
};

export default Continua;