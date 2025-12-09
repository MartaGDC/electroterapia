import { useEffect, useState } from "react";
import "./SubidaFichero.css";
import { IonAlert, IonButton, IonContent, useIonToast } from "@ionic/react";
import { useUserList } from "../../context/userListContext";
import { useTranslation } from "react-i18next";

// Referencia: https://github.com/NelsonCode/drag-and-drop-files-react/blob/master/src/components/DragArea/index.js

const SubidaFichero: React.FC = () => {
  const {t} = useTranslation();
  const [present] = useIonToast();
  const { addUsers } = useUserList();

  const [lista, setLista] = useState<string[]>([]);
  const [errores, setErrores] = useState<string[]>([]);

  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
  const [isOpenAlertError, setIsOpenAlertError] = useState<boolean>(false);

  const [notCreated, setNotCreated] = useState<{name: string}[]>([]);

  const readFile = (e: any) => {
    setErrores([])
    setLista([])

    const file = e.target.files[0]
    if (!file) return

    const fileReader = new FileReader()

    fileReader.readAsText(file)

    fileReader.onload = () => {
      const text = fileReader.result;
        
      if (typeof text === 'string') {
        const lines = text.split(/\r?\n|\r/);
        // ahora puedes trabajar con lines

        const parsedData: string[] = [];
        const erroresEncontrados: string[] = [];

        lines.forEach((line, index) => {
          // Eliminamos comillas y dividimos por ';'
          if (line !== "") {
            const fields = line.split(";");

            // Validar que haya exactamente 1 campo
            if (fields.length === 2) {
              const [nip, vacio] = fields;

              if (vacio !== "") {
                erroresEncontrados.push(`Línea ${index + 1}: Número incorrecto de campos.`);
                return;
              }
  
              // Validar que NIP sea una cadena de texto
              if (!nip || typeof nip !== "string") {
                erroresEncontrados.push(`Línea ${index + 1}: Nombre Apellidos no es válido.`);
                return;
              }
    
              // Si todas las validaciones pasan, agregamos el objeto a los datos procesados
              parsedData.push(nip);
            } else {
              erroresEncontrados.push(`Línea ${index + 1}: Número incorrecto de campos.`);
            }
          }
        });
  
        // Guardamos los datos válidos y los errores
        setLista(parsedData);
        setErrores(erroresEncontrados);
      }
    }
  }

  const create = async () => {
    const res = await addUsers(lista.map((nip: string, idx: number) => 
      ({name: nip, password: nip, role: "student"})));

    if (res.length != 0) {
      console.log(res);
      setNotCreated(res);
      setIsOpenAlertError(true);
    }
  }

  useEffect(() => {
    console.log(lista);
    console.log(errores)
  }, [lista])
  return (
    <>
      <div className="image-upload-wrap">

        <input
          className="file-upload-input"
          data-testid="file-input"
          type="file"
          onChange={(e) => readFile(e)}
        />
        <h3 className="text-information">
          Arrastre un fichero <br /> o <br /> Clique aquí para subir uno
        </h3>

      </div>

      {(lista.length > 0 && errores.length == 0) &&
          <IonContent className="data-display">
            <table>
              <thead>
                <tr>
                  <th className="campo"> NIP </th>
                </tr>
              </thead>
              <tbody>
                {lista.map((item, index) => (
                  <tr key={index}> <td>{item}</td> </tr>
                ))}
              </tbody>
            </table>
          </IonContent>
        }
        {/* Mostrar errores encontrados */}
        {errores.length > 0 && (
          <IonContent className="ion-padding">
            <div className="error-display">
              <h4>Errores encontrados:</h4>
              <ul >
                {errores.map((error, index) => (
                  <li style={{background: "none !important"}} key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </IonContent>
        )}

      {(lista.length > 0 && errores.length == 0) && 
        <div className="crear-button">
          <IonButton style={{width: "100%"}} onClick={() => setIsOpenAlert(true)}>
            Crear la lista
          </IonButton>
        </div>
      }

      <IonAlert
        isOpen={isOpenAlert}
        onDidDismiss={() => setIsOpenAlert(false)}
        //trigger="create-students"
        header={`${t('ALUMNOS.FICHERO.ALERTA_CREAR.H1')} ${lista.length} ${t('ALUMNOS.FICHERO.ALERTA_CREAR.H2')}`}
        subHeader={`${t('ALUMNOS.FICHERO.ALERTA_CREAR.SH1')} ${lista.length} ${t('ALUMNOS.FICHERO.ALERTA_CREAR.SH2')}`}
        message={`${t('ALUMNOS.FICHERO.ALERTA_CREAR.MSG1')} ${lista.length} ${t('ALUMNOS.FICHERO.ALERTA_CREAR.MSG2')}`}
        buttons={[{
          text: 'Crear',
          role: 'confirm',
          handler: async () => {
            create();
          }
        }]}
      />

      <IonAlert
        isOpen={isOpenAlertError}
        onDidDismiss={() => setIsOpenAlertError(false)}
        header={t('ALUMNOS.FICHERO.ALERTA_ERROR.H')}
        subHeader={t('ALUMNOS.FICHERO.ALERTA_ERROR.SH')}
        message={`
          ${t('ALUMNOS.FICHERO.ALERTA_ERROR.MSG')} 
          ${notCreated.map((user) => user.name).join(", ")}
        `}
        buttons={[{
          text: t('ALUMNOS.FICHERO.ALERTA_ERROR.BUTTON'),
          role: 'confirm',
          handler: () => setIsOpenAlertError(false)
        }]}
      />

    </>
  )
}

export default SubidaFichero