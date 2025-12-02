import { IonButton } from "@ionic/react";
import "./LogButton.css"
import { useLog } from "../../context/logContext";

const LogButton: React.FC<{ //componente hecho como función
  iniciar: () => any; //props que acepta, en este caso una prop llamada iniciar que devuelve any
}> =
({iniciar}) => { //la prop que acepta el componente
  const { simulating, paused, pausar, reanudar, finalizar, eliminar } = useLog(); //a partir del contexto recoge estos valores y funciones.
        //simulating y paused reciben su valor a través del reducer, el resto por su definicion también interaccionan con el reducer
  return ( //renderizado condicional:
    <> 
      {paused ? (
        <div className="log-button-container">
          <IonButton onClick={reanudar}>
            Continuar
          </IonButton>
          <IonButton color={"danger"} onClick={finalizar}>
            Detener
          </IonButton>
        </div>
      ) : simulating ? (
        <div className="log-button-container">
          <IonButton onClick={finalizar}>
            Completar
          </IonButton>
          <IonButton color={"naranja"} onClick={pausar}>
            Pausar
          </IonButton>
          <IonButton color={"danger"} onClick={eliminar}>
            Cancelar
          </IonButton>
        </div>
      ) : (
        <IonButton className="log-button" onClick={iniciar}>
          Iniciar
        </IonButton>
      )}
    </>
  );//iniciar es la funcion introducida como prop quizá porque depende del componete, mientras que el resto de funciones solo vienen del contexto.
}

export default LogButton;