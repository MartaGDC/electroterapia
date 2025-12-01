import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { initLog, saveParams, endLog, deleteLog } from "../api/log";
import { PositionsTDCS, RoomStudent, Simuladores, Time } from "../constants/interfaces";
import { Electrodo, TipoElectrodo } from "../classes/Electrodos";
import { allComplementos, allFarmacos, allProductosConduccion, allProductosProteccion, Complemento, ProductoConduccion, ProductoProteccion } from "../classes/Materiales";
import { averageApl, averageElec } from "../components/Logs/Logs";
import { Aplicador } from "../classes/Aplicadores";
import { useAplicador } from "./aplicadorContext";
import { useIonRouter } from "@ionic/react";

// --- Tipado ---
enum Estado {
  DETENIDO = "detenido",
  SIMULANDO = "simulando",
  PAUSADO = "pausado",
}

type LogState = {
  estado: Estado;
  simulating: boolean;
  paused: boolean;
};

type LogAction =
  | { type: "INICIAR" }
  | { type: "PAUSAR" }
  | { type: "REANUDAR" }
  | { type: "FINALIZAR" };

type LogContextType = {
  simulating: boolean;
  paused: boolean;
  tiempoRestante: number;
  iniciar: (type: "aprendizaje" | "simulacion" | "evaluacion", tiempo: Time, fixedParams: any, initParams: any, sim: Simuladores) => Promise<void>;
  pausar: () => void;
  reanudar: () => void;
  finalizar: () => Promise<void>;
  eliminar: () => Promise<void>;
  agregarParams: (params: any) => void;

  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>; //Esto permite cambiar los valores desde caulquier parte del código envuelta por este contexto (UserContext no tiene este tipo de código)
  height: number;
  setHeight: React.Dispatch<React.SetStateAction<number>>;

  // Canal 1
  anodoCanal1: Electrodo | null;
  setAnodoCanal1: React.Dispatch<React.SetStateAction<Electrodo | null>>;
  catodoCanal1: Electrodo | null;
  setCatodoCanal1: React.Dispatch<React.SetStateAction<Electrodo | null>>;
  
  // Canal 2
  anodoCanal2: Electrodo | null;
  setAnodoCanal2: React.Dispatch<React.SetStateAction<Electrodo | null>>;
  catodoCanal2: Electrodo | null;
  setCatodoCanal2: React.Dispatch<React.SetStateAction<Electrodo | null>>;
  
  // Complementos
  complemento: boolean[];
  setComplemento: React.Dispatch<React.SetStateAction<boolean[]>>;

  anodoTDCS: PositionsTDCS | null;
  setAnodoTDCS: React.Dispatch<React.SetStateAction<PositionsTDCS | null>>;
  catodoTDCS: PositionsTDCS | null;
  setCatodoTDCS: React.Dispatch<React.SetStateAction<PositionsTDCS | null>>;
  
  // Aplicadores
  aplicador1: null | Aplicador;
  setAplicador1: React.Dispatch<React.SetStateAction<null | Aplicador>>;
  aplicador2: null | Aplicador;
  setAplicador2: React.Dispatch<React.SetStateAction<null | Aplicador>>;

  // Productos de conducción
  conduccion: boolean[];
  setConduccion: React.Dispatch<React.SetStateAction<boolean[]>>;
  
  // Productos de protección
  proteccion: boolean[];
  setProteccion: React.Dispatch<React.SetStateAction<boolean[]>>;

  // Fármacos
  farmaco: boolean[];
  setFarmaco: React.Dispatch<React.SetStateAction<boolean[]>>;

  // Sala
  room: RoomStudent | null;

  // Funciones
  reset: () => void;
  establecerActividad: (act: RoomStudent) => void;

};

// --- Context ---
const LogContext = createContext<LogContextType | null>(null);
export const useLog = () => {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error("useLog debe usarse dentro de LogProvider");
  return ctx;
};

// --- Reducer ---
const reducer = (state: LogState, action: LogAction): LogState => {
  switch (action.type) {
    case "INICIAR":
      return { estado: Estado.SIMULANDO, simulating: true, paused: false };
    case "PAUSAR":
      return { estado: Estado.PAUSADO, simulating: true, paused: true };
    case "REANUDAR":
      return { estado: Estado.SIMULANDO, simulating: true, paused: false };
    case "FINALIZAR":
      return { estado: Estado.DETENIDO, simulating: false, paused: false };
    default:
      return state;
  }
};

// --- Provider ---
export const LogProvider = ({ children }: { children: React.ReactNode }) => {

  const router = useIonRouter();

  const {resetAplicadorContext} = useAplicador(); //del objeto useAplicador de aplicadorContext, recoge solo la funcion resetAplicadorContext
  // Estado del log
  const [state, dispatch] = useReducer(
    reducer, 
    { estado: Estado.DETENIDO, simulating: false, paused: false }
  );

  const [room, setRoom] = useState<RoomStudent | null>(null);

  // SessionId del log actual
  const tipo = useRef<"aprendizaje" | "simulacion" | "evaluacion" | null>(null);

  // SessionId del log actual
  const sessionIdRef = useRef<string | null>(null);

  // Referencia al intervalo periódico que guarda los parámetros
  const intervalIdRef = useRef<any>(null);

  // Almacena los parámetros que se almacenan en el log. Se actualizan con la
  // función "actualizarLogs" y se vacía cada "intervalSave" segundos tras
  // haberlos almacenado en BD
  const paramsRef = useRef<any[]>([]);

  // Referencia al timeout que controla el tiempo que queda de simulación
  const timeoutRef = useRef<any>(null);

  // En caso de pausa, esta referencia almacena el tiempo restante para terminar
  // la simulación
  const tiempoRestanteRef = useRef<number>(0);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  // Almacena el instante en el que se comenzó / reanudó por última vez el log
  const ultimaReanudacionRef = useRef<number | null>(null);

  const intervalSave = 5000;

  //////////////////////////////////////////////////////////////////////////////
  // Parámetros presentes en todas las simulaciones
  //////////////////////////////////////////////////////////////////////////////
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Canal 1
  const [anodoCanal1, setAnodoCanal1] = useState<Electrodo | null>(null)
  const [catodoCanal1, setCatodoCanal1] = useState<Electrodo | null>(null)

  const catPosSum1 = useRef<Electrodo>(new Electrodo(0, 0, TipoElectrodo.CATODO, "#000000", null, 1));
  const iCat1 = useRef(0);
  const andPosSum1 = useRef<Electrodo>(new Electrodo(0, 0, TipoElectrodo.ANODO, "#ff0000", null, 1));
  const iAnd1 = useRef(0);
  
  // Canal 2
  const [anodoCanal2, setAnodoCanal2] = useState<Electrodo | null>(null)
  const [catodoCanal2, setCatodoCanal2] = useState<Electrodo | null>(null)

  const catPosSum2 = useRef<Electrodo>(new Electrodo(0, 0, TipoElectrodo.CATODO, "#000000", null, 2));
  const iCat2 = useRef(0);
  const andPosSum2 = useRef<Electrodo>(new Electrodo(0, 0, TipoElectrodo.ANODO, "#ff0000", null, 2));
  const iAnd2 = useRef(0);

  // Complemento
  const [complemento, setComplemento] = useState<boolean[]>(Array.from({length: allComplementos.length}, () => false));
  const [anodoTDCS, setAnodoTDCS] = useState<PositionsTDCS | null>(null);
  const [catodoTDCS, setCatodoTDCS] = useState<PositionsTDCS | null>(null);

  // Aplicador
  const [aplicador1, setAplicador1] = useState<null | Aplicador>(null);
  const [aplicador2, setAplicador2] = useState<null | Aplicador>(null);

  const aplSum1 = useRef<{x: number, y: number}>({x: 0, y: 0});
  const iApl1 = useRef(0);
  const aplSum2 = useRef<{x: number, y: number}>({x: 0, y: 0});
  const iApl2 = useRef(0);

  // Producto de conducción
  const [conduccion, setConduccion] = useState<boolean[]>(Array.from({length: allProductosConduccion.length}, () => false));

  // Producto de protección
  const [proteccion, setProteccion] = useState<boolean[]>(Array.from({length: allProductosProteccion.length}, () => false));
  
  // Farmacos
  const [farmaco, setFarmaco] = useState<boolean[]>(Array.from({length: allFarmacos.length}, () => false));

  //////////////////////////////////////////////////////////////////////////////
  // Materiales de todas simulaciones
  //////////////////////////////////////////////////////////////////////////////
  const lastSavedParams = useRef<{time: any, params: any} | null>(null);

  const reset = () => {
    setAnodoCanal1(null);
    setCatodoCanal1(null);
    setAnodoCanal2(null);
    setCatodoCanal2(null);
    setComplemento(Array.from({length: allComplementos.length}, () => false));
    setAplicador1(null);
    setAplicador2(null);
    setConduccion(Array.from({length: allProductosConduccion.length}, () => false));
    setProteccion(Array.from({length: allProductosProteccion.length}, () => false));
    setFarmaco(Array.from({length: allFarmacos.length}, () => false));
    resetAplicadorContext();
    
    dispatch({ type: "FINALIZAR" });
  };

  const materialVariableParams = (
    and1: Electrodo | null = anodoCanal1,
    cat1: Electrodo | null = catodoCanal1,
    and2: Electrodo | null = anodoCanal2,
    cat2: Electrodo | null = catodoCanal2,
    apl1: Aplicador | null = aplicador1,
    apl2: Aplicador | null = aplicador2
  ) => {
    return {
      width, height,
      // Canal 1
      anodoCanal1: and1, catodoCanal1: cat1,
      // Canal 2
      anodoCanal2: and2, catodoCanal2: cat2,
      // Aplicadores
      aplicador1: apl1, aplicador2: apl2
    }
  }

  const materialFixedParams = () => {
    return {
      // Complementos
      complemento, anodoTDCS, catodoTDCS,
      // Productos de conducción
      conduccion,
      // Productos de protección
      proteccion,
      // Fármacos
      farmaco
    }
  }

  const constructVariableParams = (
    variableParams: {time: any, params: any},
    and1: Electrodo | null = anodoCanal1,
    cat1: Electrodo | null = catodoCanal1,
    and2: Electrodo | null = anodoCanal2,
    cat2: Electrodo | null = catodoCanal2,
    apl1: Aplicador | null = aplicador1,
    apl2: Aplicador | null = aplicador2
  ) => {
    return {
      time: variableParams.time,
      params: { 
        ...variableParams.params, 
        ...materialVariableParams(and1, cat1, and2, cat2) 
      }
    }
  }

  const constructFixedParams = (
    fixedParams: any
  ) => {
    return { ...fixedParams, ...materialFixedParams() }
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////
  // LOGS
  //////////////////////////////////////////////////////////////////////////////
  const establecerActividad = (act: RoomStudent) => {
    setRoom(act);
  }

  // Crea un nuevo log. Llama a la BD para crearlo con los primeros parámetros,
  // inicia el autoguardado de parámetros ("iniciarGuardado") y actualiza el 
  // estado del log  
  const iniciar = async (
    type: "aprendizaje" | "simulacion" | "evaluacion",
    tiempo: Time, 
    fixedParams: any,
    initParams: {time: any, params: any}, 
    simulator: Simuladores,
  ) => {
    tipo.current = type;

    if (tipo.current != "aprendizaje") {
      lastSavedParams.current = initParams;
      const res = await initLog({
        type: tipo.current,
        params: constructVariableParams(initParams), 
        fixedParams: constructFixedParams(fixedParams), 
        simulator,
        ...(tipo.current == "evaluacion" ? {roomId: room?._id} : {})
      });
      if (res.status !== 200 || !res.data?.sessionId) return;
    
      sessionIdRef.current = res.data.sessionId;
      iniciarGuardado();  
    }

    dispatch({ type: "INICIAR" });
  
    tiempoRestanteRef.current = tiempo.toSeconds() * 1000;
    setTiempoRestante(tiempoRestanteRef.current);
  
    ultimaReanudacionRef.current = Date.now();

    cuentaAtras();
  };
  
  // Establece un intervalo que se encarga del guardado cada "intervalSave" ms
  const iniciarGuardado = () => {
    if (intervalIdRef.current) return;

    intervalIdRef.current = setInterval(async () => {
      if (!sessionIdRef.current || paramsRef.current.length === 0) return;
      const res = await saveParams({ sessionId: sessionIdRef.current, params: paramsRef.current });
      if (res.status === 200) paramsRef.current.length = 0;
    }, intervalSave);
  };

  // Detiene el guardado automático de parámetros. Se usa al pausar y finalizar
  // un log
  const detenerGuardado = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  // Pausa el log. Detiene el guardado automático de parámetros y actualiza el 
  // estado
  const pausar = () => {
    detenerGuardado();
    dispatch({ type: "PAUSAR" });
  
    // Calcular cuánto tiempo queda
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);

      // Se calcula el tiempo restante para disponerlo al reanudar el log
      setTiempoRestante(tiempoRestanteRef.current);
      timeoutRef.current = null;
    }
  };
  
  // Se reanuda el log. Se actualiza el estado, se vuelve a iniciar el guardado
  // automático de parámetros y se establece de nuevo el timeout para finalizar
  // el log
  const reanudar = () => {
    if (tiempoRestanteRef.current <= 0) return;
  
    if (tipo.current != "aprendizaje" && sessionIdRef.current) iniciarGuardado();
    dispatch({ type: "REANUDAR" });
  
    ultimaReanudacionRef.current = Date.now();
    
    cuentaAtras();
  };
  
  // Finaliza el log llamando a la BD, detiene el guardado y actualiza el estado
  const finalizar = async () => {
    if (tipo.current != "aprendizaje") detenerGuardado();
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  
    if (tipo.current != "aprendizaje" && sessionIdRef.current) {
      await endLog({ sessionId: sessionIdRef.current, params: paramsRef.current });
    }
    sessionIdRef.current = null;
    paramsRef.current = [];
  
    dispatch({ type: "FINALIZAR" });

    if (tipo.current == "evaluacion") {
      setRoom(null);
      router.push('/app/evaluacion');
    }
  };

  const eliminar = async () => {
    if (tipo.current != "aprendizaje") detenerGuardado();

    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  
    if (tipo.current != "aprendizaje" && sessionIdRef.current) {
      await deleteLog({ 
        sessionId: sessionIdRef.current, 
        ...(tipo.current == "evaluacion" ? { roomId: room?._id } : {  }) 
      });
    }
    sessionIdRef.current = null;
    paramsRef.current = [];
  
    dispatch({ type: "FINALIZAR" });
  }

  const cuentaAtras = () => {
    timeoutRef.current = setInterval(() => {
      tiempoRestanteRef.current -= 1000;
      setTiempoRestante(tiempoRestanteRef.current);

      if (tiempoRestanteRef.current == 0) finalizar();
    }, 1000)
  }
  
  // Actualiza los parámetros que se almacenarán en el log
  const agregarParams = (p: {time: any, params: any}) => {
    if (state.estado === Estado.SIMULANDO) {
      lastSavedParams.current = p;
      paramsRef.current.push(constructVariableParams(p));
    } else if (state.estado === Estado.PAUSADO) {
      // Si está pausado, nos quedamos con la última versión de parámetros 
      // actuales, que se guardará en BD al reanudar
      lastSavedParams.current = p;
      paramsRef.current.length = 0;
      paramsRef.current.push(constructVariableParams(p));
    }
  };

  // Actualiza los parámetros que se almacenarán en el log
  const agregarElecs = (
    time: any, 
    and1: Electrodo | undefined = undefined,
    cat1: Electrodo | undefined = undefined,
    and2: Electrodo | undefined = undefined,
    cat2: Electrodo | undefined = undefined,
    apl1: Aplicador | undefined = undefined,
    apl2: Aplicador | undefined = undefined
  ) => {
    if (state.estado === Estado.SIMULANDO) {
      paramsRef.current.push(
        constructVariableParams(
          { time: time, params: lastSavedParams.current?.params },
          and1, cat1, and2, cat2, apl1, apl2
        )
      );
    } else if (state.estado === Estado.PAUSADO) {
      // Si está pausado, nos quedamos con la última versión de parámetros 
      // actuales, que se guardará en BD al reanudar
      paramsRef.current.length = 0;
      paramsRef.current.push(
        constructVariableParams(
          { time: time, params: lastSavedParams.current?.params },
          and1, cat1, and2, cat2, apl1, apl2
        )
      );
    }
  };
  

  useEffect(() => {
    if (state.simulating == true && lastSavedParams.current !== null) {
      averageElec(
        andPosSum1,
        iAnd1,
        (a) => agregarElecs(Date.now(), a),
        anodoCanal1!
      )  
    }
  }, [anodoCanal1])

  useEffect(() => {
    if (state.simulating == true && lastSavedParams.current !== null) {
      console.log(anodoCanal1)
      averageElec(
        catPosSum1,
        iCat1,
        (c) => agregarElecs(Date.now(), undefined, c),
        catodoCanal1!
      )  
    }
  }, [catodoCanal1])

  useEffect(() => {
    if (state.simulating == true && lastSavedParams.current !== null) {
      averageElec(
        andPosSum2,
        iAnd2,
        (a) => agregarElecs(Date.now(), undefined, undefined, a),
        anodoCanal2!
      )  
    }
  }, [anodoCanal2])

  useEffect(() => {
    if (state.simulating == true && lastSavedParams.current !== null) {
      averageElec(
        catPosSum2,
        iCat2,
        (c) => agregarElecs(Date.now(), undefined, undefined, undefined, c),
        catodoCanal2!
      )
    }
  }, [catodoCanal2])

  useEffect(() => {
    if (state.simulating == true && lastSavedParams.current !== null && aplicador1 !== null) {
      averageApl(
        aplSum1,
        iApl1,
        (a) => agregarElecs(
          Date.now(), 
          undefined, undefined, undefined, undefined,
          new Aplicador(a.x, a.y, aplicador1?.modo, aplicador1.color)
        ),
        { x: aplicador1.x, y: aplicador1.y }
      )
    }
  }, [aplicador1])

  useEffect(() => {
    if (state.simulating == true && lastSavedParams.current !== null && aplicador2 !== null) {
      averageApl(
        aplSum2,
        iApl2,
        (a) => agregarElecs(
          Date.now(), 
          undefined, undefined, undefined, undefined, undefined,
          new Aplicador(a.x, a.y, aplicador2?.modo, aplicador2.color)
        ),
        { x: aplicador2.x, y: aplicador2.y }
      )
    }
  }, [aplicador2])

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  return (
    <LogContext.Provider
      value={{
        simulating: state.simulating,
        paused: state.paused,
        tiempoRestante: tiempoRestante,
        iniciar,
        pausar,
        reanudar,
        finalizar,
        eliminar,
        agregarParams,

        width,
        setWidth,
        height,
        setHeight,
        
        anodoCanal1,
        setAnodoCanal1,
        catodoCanal1,
        setCatodoCanal1,
        anodoCanal2,
        setAnodoCanal2,
        catodoCanal2,
        setCatodoCanal2,
        complemento,
        setComplemento,
        anodoTDCS,
        setAnodoTDCS,
        catodoTDCS,
        setCatodoTDCS,
        aplicador1,
        setAplicador1,
        aplicador2,
        setAplicador2,
        conduccion,
        setConduccion,
        proteccion,
        setProteccion,
        farmaco,
        setFarmaco,

        room,
        reset,
        establecerActividad
      }}
    >
      {children}
    </LogContext.Provider>
  );
};
