import { IonAlert, IonButton, IonButtons, IonCard, IonCheckbox, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonPage, IonSearchbar, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import constants from '../constants/constants';
import { Roles } from '../constants/interfaces';
import "./Alumnos.css"
import { add, trashOutline } from 'ionicons/icons';
import { useUserList } from '../context/userListContext';
import AlumnosCrearModal from '../components/Alumnos/AlumnosCrearModal';

type UserList = {
  _id: string;
  name: string;
  role: Roles.ALUMNO | Roles.PROFESOR;
}

const Alumnos: React.FC = () => {
  const { 
    users, selected, numProfesores, getUsers, selectUser, selectAllUsers,
    deleteSelectedUsers, search
  } = useUserList();
  
  const router = useIonRouter();
  const {t} = useTranslation();

  // const [alumnos, setAlumnos] = useState<UserList[]>([]);
  const [results, setResults] = useState<UserList[]>([]);
  const [allChecked, setAllChecked] = useState<boolean>(false);

  const [modalCrear, setModalCrear] = useState(false);

  const navigateButton = (path: any) => {
    event?.preventDefault();
    router.push(path);
  };

  // const handleInput = (event: Event) => {
  //   let query = '';
  //   const target = event.target as HTMLIonSearchbarElement;
  //   if (target) query = target.value!.toLowerCase();

  //   setResults(users.filter((d) => d.name.toLowerCase().indexOf(query) > -1));
  // };

  useEffect(() => {
    getUsers();
  }, [])

  useEffect(() => {
    setResults(users);
  }, [users])

  return (
    <IonPage>
      <IonHeader className='page-header'>
        <IonToolbar className=''>
          <IonButtons className='ion-margin' slot='start'>
            <IonMenuButton color={'background'} className='ion-margin-end'/>
          </IonButtons>
          <div className='titulo-page'>
            <IonIcon icon={constants.alumnosIcon}/>
            <IonTitle> {t("MENU.USUARIOS")} </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className='content-aprendizaje' fullscreen>
        <IonSearchbar 
          showClearButton="always"
          onIonInput={(event) => search(event)}
        ></IonSearchbar>
        <div className='header-content-alumnos ion-margin'>
          <IonCheckbox
            labelPlacement='end'
            checked={allChecked}
            style={{fontWeight: "bold", fontSize: "18px"}}
            onClick={() => {
              selectAllUsers(!allChecked);
              setAllChecked(!allChecked);
            }}
          >
            {t('ALUMNOS.SELECCIONAR')} 
          </IonCheckbox>
          <IonButton id="present-alert" color={'danger'}>
            <IonIcon src={trashOutline}/>
            Eliminar
          </IonButton>
        </div>

        <IonAlert
          trigger="present-alert"
          header="Confirmar eliminar"
          subHeader="¿Está seguro de que quiere eliminar los usuarios seleccionados?"
          message="La acción no se puede deshacer"
          buttons={[{
            text: 'Eliminar',
            role: 'confirm',
            handler: async () => {
              await deleteSelectedUsers();
              setAllChecked(false);
            }
          }]}
        />

        {results.map((alumno, idx) => (
          <IonCard key={idx} className='alumno-card'>
            <div className='alumno-card-header'>
              <div className='alumno-card-left'>
                <IonCheckbox 
                  className='check-alumno ion-margin-end' 
                  checked={selected[alumno._id]} 
                  onClick={() => {
                    setAllChecked(false);
                    selectUser(alumno._id, !selected[alumno._id]);
                  }}
                />
                <div className='alumno-name'>{alumno.name}</div>
              </div>
              <div className='alumno-role'>
                {alumno.role == "student" ? t('ALUMNOS.LISTA.ALUMNO')
                  : alumno.role == "teacher" ? t('ALUMNOS.LISTA.PROFESOR')
                  : ""
                }
              </div>
            </div>
          </IonCard>
        ))}

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setModalCrear(true)} color={'dark'}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <AlumnosCrearModal
          isOpen={modalCrear}
          setIsOpen={setModalCrear}
        />
      </IonContent>
    </IonPage>
  );
};

export default Alumnos;