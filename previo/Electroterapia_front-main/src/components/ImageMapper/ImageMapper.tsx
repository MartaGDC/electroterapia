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

const ImageMapper: React.FC = () => {
  const {
    simulating,
    anodoCanal1, setAnodoCanal1, catodoCanal1, setCatodoCanal1, anodoCanal2,
    setAnodoCanal2, catodoCanal2, setCatodoCanal2, complemento, 
    aplicador1, setAplicador1, aplicador2, setAplicador2,
    conduccion, proteccion, width, setWidth, height, setHeight
  } = useLog();

  const electrodos = [
    { e: anodoCanal1, setE: setAnodoCanal1 },
    { e: catodoCanal1, setE: setCatodoCanal1 },
    { e: anodoCanal2, setE: setAnodoCanal2 },
    { e: catodoCanal2, setE: setCatodoCanal2 },
  ];

  const aplicadores = [
    { apl: aplicador1, setApl: setAplicador1 },
    { apl: aplicador2, setApl: setAplicador2 },
  ]

  const [draggingIndexElec, setDraggingIndexElec] = useState<number | null>(null);
  const [draggingIndexApl, setDraggingIndexApl] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  //////////////////////////////////////////////////////////////////////////////
  // Gestionar posición electrodos
  //////////////////////////////////////////////////////////////////////////////
  const handleStartElec = (index: number) => {
    setDraggingIndexElec(index);
  };

  const handleStartApl = (index: number) => {
    setDraggingIndexApl(index);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (draggingIndexElec === null && draggingIndexApl === null) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const isTouch = "touches" in e;
    const clientX = isTouch ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouch ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const newX = ((clientX - rect.left) / rect.width) * 100;
    const newY = ((clientY - rect.top) / rect.height) * 100;
    // const newX = ((clientX - rect.left / rect.width) * 100);
    // const newY = ((clientY - rect.top / rect.height) * 100);

    if (draggingIndexApl !== null) {
      aplicadores[draggingIndexApl].setApl((prevApl) => 
        prevApl != null
          ? new Aplicador(newX, newY, prevApl.modo, prevApl.color)
          : null
      );
    } else if (draggingIndexElec !== null) {
      electrodos[draggingIndexElec].setE((prevElectrodo) => 
        prevElectrodo != null 
          ? new Electrodo(newX, newY, prevElectrodo.type, prevElectrodo.color, prevElectrodo.material, prevElectrodo.canal)
          : null
      );  
    }
  };

  const handleEndElec = (index: number) => {
    setDraggingIndexElec(null);
  };

  const handleEndApl = (index: number) => {
    setDraggingIndexApl(null);
  };


  //////////////////////////////////////////////////////////////////////////////
  // Observa el ancho y alto de la imagen
  //////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setWidth(width);
        setHeight(height);
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
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        className="cuerpo-img"
      >
        <img src={cuerpo}/>

        {electrodos.map((elec, index) => (
          elec.e != null ? 
            <div
              key={index}
              className="electrodo-div"
              style={{
                backgroundColor: elec.e.color,
                left: `calc(${elec.e.x}% - 10px)`,
                top: `calc(${elec.e.y}% - 10px)`,
              }}
              onMouseDown={() => handleStartElec(index)}
              onMouseUp={() => handleEndElec(index)}
              onTouchStart={() => handleStartElec(index)}
              onTouchEnd={() => handleEndElec(index)}
            >
              {elec.e.name}
            </div>
          : null
        ))}

        {aplicadores.map((apl, index) => (
          apl.apl != null ?
            <div
              key={index}
              className="electrodo-div"
              style={{
                backgroundColor: apl.apl.color,
                left: `calc(${apl.apl.x}% - 10px)`,
                top: `calc(${apl.apl.y}% - 10px)`,
              }}
              onMouseDown={() => handleStartApl(index)}
              onMouseUp={() => handleEndApl(index)}
              onTouchStart={() => handleStartApl(index)}
              onTouchEnd={() => handleEndApl(index)}
            >
              {apl.apl.icono()}
            </div>
          : null
        ))}
      </div>
      <MaterialMenu />
    </IonCard>
  );
}


export default ImageMapper;