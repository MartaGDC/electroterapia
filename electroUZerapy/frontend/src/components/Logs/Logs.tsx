//import { endLog, initLog, saveParams } from "../../api/log";
import { Electrodo } from "../../classes/Electrodos";
//import { Simuladores, Time } from "../../constants/interfaces";

//const intervalSave = 5000; // ms

////////////////////////////////////////////////////////////////////////////////
// Guardar parametro
////////////////////////////////////////////////////////////////////////////////
const itersElec = 10;
export const averageElec = (
  avgParam: React.RefObject<Electrodo>,
  iCount: React.RefObject<number>,
  callBack: (pos: any) => void,
  newElec: Electrodo
) => {
  // Acumular la posición del cátodo
  avgParam.current = avgParam.current?.add(newElec);

  // Incrementar contador
  iCount.current = iCount.current + 1;

  if (iCount.current >= itersElec) {
    // Promediar la posición acumulada
    const avgPos = { x: avgParam.current?.x / itersElec, y: avgParam.current?.y / itersElec };

    callBack(new Electrodo(
      avgPos.x, 
      avgPos.y, 
      newElec.type, 
      undefined, 
      newElec.material, 
      newElec.canal
    ));

    avgParam.current = new Electrodo(0, 0, avgParam.current.type, undefined, avgParam.current.material, avgParam.current.canal); // Reiniciar sumatoria
    iCount.current = 0;
  }
}

export const averageApl = (
  avgPos: React.RefObject<{x: number, y: number}>,
  iCount: React.RefObject<number>,
  callBack: (pos: any) => void,
  newApl: {x: number, y: number}
) => {
  // Acumular la posición del cátodo
  avgPos.current = { x: avgPos.current.x + newApl.x, y: avgPos.current.y + newApl.y };

  // Incrementar contador
  iCount.current = iCount.current + 1;

  if (iCount.current >= itersElec) {
    // Promediar la posición acumulada
    const avg = { x: avgPos.current.x / itersElec, y: avgPos.current.y / itersElec };

    callBack(avg);

    avgPos.current = { x: 0, y: 0 }; // Reiniciar sumatoria
    iCount.current = 0;
  }
}
