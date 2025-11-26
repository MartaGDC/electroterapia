import { IonButton } from "@ionic/react";
import "./LogButton.css"
import { useLog } from "../../context/logContext";

const LogButton: React.FC<{
  iniciar: () => any;
}> = ({
  iniciar
}) => {
  const { simulating, paused, pausar, reanudar, finalizar, eliminar } = useLog();
  return (
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
  );
}

export default LogButton;