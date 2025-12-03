import { IonIcon } from "@ionic/react";
import constants from "../constants/constants";
import { AplicadorDiatermia, AplicadorInfrarrojos, AplicadorLaser, AplicadorMagnetoterapia, AplicadorMicroondas, AplicadorOndaCorta, AplicadorOndasChoque, AplicadorUltrasonidos, AplicadorUltravioletas } from "./TiposAplicadores";

export class Aplicador {
  x: number;
  y: number;
  modo: AplicadorDiatermia | AplicadorOndaCorta | AplicadorMicroondas 
    | AplicadorInfrarrojos | AplicadorLaser | AplicadorUltravioletas 
    | AplicadorMagnetoterapia | AplicadorUltrasonidos | AplicadorOndasChoque;
  color: string;

  constructor(
    x: number = 50, 
    y: number = 50, 
    modo: AplicadorDiatermia | AplicadorOndaCorta | AplicadorMicroondas 
    | AplicadorInfrarrojos | AplicadorLaser | AplicadorUltravioletas 
    | AplicadorMagnetoterapia | AplicadorUltrasonidos | AplicadorOndasChoque,
    color: string | null = null
  ) {
    this.x = x;
    this.y = y;
    this.modo = modo;
    this.color = color == null ? "#000000" : color;
  }

  add(e: Aplicador): Aplicador {
    return new Aplicador(this.x + e.x, this.y + e.y, this.modo);
  }

  icono() {
    return <IonIcon src={constants.aplicadoresIcon}/>;
  }
};

export enum Aplicadores {
  DIATERMIA = 0,
  ONDA_CORTA = 1,
  MICROONDAS = 2,
  INFRARROJOS = 3,
  LASER = 4,
  ULTRAVIOLETAS = 5,
  MAGNETOTERAPIA = 6,
  ULTRASONIDOS = 7,
  ONDAS_CHOQUE = 8,
};

export const allAplicadores = [
  Aplicadores.DIATERMIA, Aplicadores.ONDA_CORTA, Aplicadores.MICROONDAS, 
  Aplicadores.INFRARROJOS, Aplicadores.LASER, Aplicadores.ULTRAVIOLETAS, 
  Aplicadores.MAGNETOTERAPIA, Aplicadores.ULTRASONIDOS, Aplicadores.ONDAS_CHOQUE
];