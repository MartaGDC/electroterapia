//importacion de iconos, accesibles en otros componenetes al estar en este objeto constants
import { bodyOutline, desktopOutline, documentTextOutline, bulbOutline, locateOutline, medkitOutline, receiptOutline, schoolOutline, warningOutline, waterOutline, eyeOutline } from "ionicons/icons";

const constants = {  
  modes: [ //array de configuraciones de modos, cada uno tiene name, ruta a la pantalla de aprendizaje y ruta a la de simulación.
           // Se usa para construir menús dinámicamente, evitar rutas hardcodeadas en varios lugares, mostrar botones o tarjetas con acceso directo, recorrer modos en pantallas de selección
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
  timeLog: 5000, // ms. Probablemente para refrescar logs, temporizadores, polling, intervalos
  apiURL: "http://192.168.0.15:4000/api/", //url base del backend MODIFICADO PARA COINCIDA CON EL DEFINIDO EL BACKEND
  //apiURL: 'https://electroterapia-back.onrender.com/api/', //url base del backend
  izqColAprendizaje: '6', //probablemente se usará para definir el número de columnas en layouts
  dchColAprendizaje: '6',
  izqColSimulacion: '6',
  dchColSimulacion: '6',
  aprendizajeIcon: desktopOutline, //asociar partes de menú a iconos importados
  simulacionIcon: bodyOutline,
  evaluacionIcon: documentTextOutline,
  continuaIcon: bulbOutline,
  verIcon: eyeOutline,
  alumnosIcon: schoolOutline,
  complementosIcon: medkitOutline,
  aplicadoresIcon: locateOutline,
  conduccionIcon: waterOutline,
  proteccionIcon: warningOutline,
  farmacosIcon: receiptOutline,
  tramos: { //tabla de colores para acceder a ellos desde otros componentes
    blanco: "#ffffff",
    verdeClaro: "#00aa00",
    verde: "#00ff00",
    amarillo: "#ffff00",
    rojo: "#ff0000"
  }
};

export default constants;