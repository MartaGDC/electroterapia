import { bodyOutline, desktopOutline, documentTextOutline, locateOutline, medkitOutline, receiptOutline, schoolOutline, warningOutline, waterOutline } from "ionicons/icons";

const constants = {
  modes: [
    {
      name: "Galvánico", 
      pathAprendizaje: "/galvanicoAprendizaje",
      pathSimulacion: "/galvanicoSimulacion"
    },
    {
      name: "Ondas de choque", 
      pathAprendizaje: "/choqueAprendizaje",
      pathSimulacion: "/choqueSimulacion"
    },
  ],
  timeLog: 5000, // ms
  apiURL: "http://localhost:8080/api/",
  izqColAprendizaje: '6',
  dchColAprendizaje: '6',
  izqColSimulacion: '6',
  dchColSimulacion: '6',
  aprendizajeIcon: desktopOutline,
  simulacionIcon: bodyOutline,
  evaluacionIcon: documentTextOutline,
  alumnosIcon: schoolOutline,
  complementosIcon: medkitOutline,
  aplicadoresIcon: locateOutline,
  conduccionIcon: waterOutline,
  proteccionIcon: warningOutline,
  farmacosIcon: receiptOutline,
  tramos: {
    blanco: "#ffffff",
    verdeClaro: "#00aa00",
    verde: "#00ff00",
    amarillo: "#ffff00",
    rojo: "#ff0000"
  }
};

export default constants;