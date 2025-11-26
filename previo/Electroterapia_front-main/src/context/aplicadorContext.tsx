import { createContext, useContext, useState } from "react";
import { Aplicadores } from "../classes/Aplicadores";

type AplicadorContextType = {
  modoAplicador: Aplicadores | null;
  setModoAplicador: React.Dispatch<React.SetStateAction<Aplicadores | null>>;

  activo: any;
  setActivo: React.Dispatch<React.SetStateAction<any>>;
  pasivo: any;
  setPasivo: React.Dispatch<React.SetStateAction<any>>;

  // Diatermia
  modoDiatermia: number | null;
  setModoDiatermia: React.Dispatch<React.SetStateAction<number | null>>;

  // Onda Corta
  modoOndaCorta: number | null;
  setModoOndaCorta: React.Dispatch<React.SetStateAction<number | null>>;

  // Láser
  tipoLaser: number | null;
  setTipoLaser: React.Dispatch<React.SetStateAction<number | null>>;

  // Magnetoterapia
  tipoMagnetoterapia: number | null;
  setTipoMagnetoterapia: React.Dispatch<React.SetStateAction<number | null>>;

  // Ondas choque
  tipoOndasChoque: number | null;
  setTipoOndasChoque: React.Dispatch<React.SetStateAction<number | null>>;

  resetAplicadorContext: () => void;
};

// --- Context ---
const AplicadorContext = createContext<AplicadorContextType | null>(null);
export const useAplicador = () => {
  const ctx = useContext(AplicadorContext);
  if (!ctx) throw new Error("useLog debe usarse dentro de LogProvider");
  return ctx;
};

// --- Provider ---
export const AplicadorProvider = ({ children }: { children: React.ReactNode }) => {

  const [modoAplicador, setModoAplicador] = useState<Aplicadores | null>(null);
  const [activo, setActivo] = useState<any>(null);
  const [pasivo, setPasivo] = useState<any>(null);

  // Diatermia
  const [modoDiatermia, setModoDiatermia] = useState<number | null>(null);

  // Onda Corta
  const [modoOndaCorta, setModoOndaCorta] = useState<number | null>(null);

  // Láser
  const [tipoLaser, setTipoLaser] = useState<number | null>(null);

  // Magnetoterapia
  const [tipoMagnetoterapia, setTipoMagnetoterapia] = useState<number | null>(null);

  const [tipoOndasChoque, setTipoOndasChoque] = useState<number | null>(null);

  const resetAplicadorContext = () => {
    setModoAplicador(null);
    setModoDiatermia(null);
    setModoOndaCorta(null);
    setActivo(null);
    setPasivo(null);  
  }
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  return (
    <AplicadorContext.Provider
      value={{
        modoAplicador,
        setModoAplicador,
        activo,
        setActivo,
        pasivo,
        setPasivo,

        modoDiatermia,
        setModoDiatermia,

        modoOndaCorta,
        setModoOndaCorta,

        tipoLaser,
        setTipoLaser,

        tipoMagnetoterapia,
        setTipoMagnetoterapia,

        tipoOndasChoque, 
        setTipoOndasChoque,
        
        resetAplicadorContext
      }}
    >
      {children}
    </AplicadorContext.Provider>
  );
};
