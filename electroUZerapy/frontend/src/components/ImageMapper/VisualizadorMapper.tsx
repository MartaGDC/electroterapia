import { useState, useRef, useEffect } from "react";
import { IonCard } from "@ionic/react";
import "./ImageMapper.css"
import PosteriorCuerpo from "./Posterior";
import AnteriorCuerpo from "./Anterior";
import { Electrodo } from "../../classes/Electrodos";
import MaterialMenu from "./MaterialMenu";
import { useLog } from "../../context/logContext";
import { Aplicador } from "../../classes/Aplicadores";
import cuerpo from "../../assets/cuerpo.webp"

const VisualizadorMapper: React.FC<{
  electrodos: (Electrodo | null)[];
  aplicadores: (Aplicador | null)[];
  width: number;
  height: number;
}> = ({
  electrodos, aplicadores, width, height
}) => {

  const [newWidth, setNewWidth] = useState(0);
  const [newWeight, setNewHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  //////////////////////////////////////////////////////////////////////////////
  // Observa el ancho y alto de la imagen
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setNewWidth(width);
        setNewHeight(height);
      }
    });
  
    observer.observe(container);
  
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <IonCard className='image-mapper ion-no-margin'>
      <div 
        ref={containerRef}
        className="cuerpo-img"
      >
        <img src={cuerpo}/>

        {electrodos.map((elec, index) => (
          elec != null ? 
            <div
              key={index}
              className="electrodo-div"
              style={{
                backgroundColor: elec.color,
                left: `calc(${elec.x}% - 10px)`,
                top: `calc(${elec.y}% - 10px)`,
              }}
            >
              {elec.name}
            </div>
          : null
        ))}

        {aplicadores.map((apl, index) => (
          apl != null ?
            <div
              key={index}
              className="electrodo-div"
              style={{
                backgroundColor: apl.color,
                left: `calc(${apl.x}% - 10px)`,
                top: `calc(${apl.y}% - 10px)`,
              }}
            >
              {apl.icono()}
            </div>
          : null
        ))}
      </div>
    </IonCard>
  );
}


export default VisualizadorMapper;