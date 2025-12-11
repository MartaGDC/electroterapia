export class Time {
/*
Representa un tiempo en minutos y segundos.
El constructor recibe minutos, segundos y opcionalmente milisegundos y los normaliza (pasa segundos y milisegundos a minutos y segundos)
Tiene las funciones descontar() (cuenta atras de segundos) y toSeconds() que devuelve el tiempo total en segundos.
*/
  minutes: number;
  seconds: number;

  constructor(min: number, sec: number, ms: number = 0) {
    this.minutes = min + Math.floor(sec / 60) + Math.floor(ms / 60000);
    this.seconds = (sec + Math.floor(ms / 1000)) % 60;

    this.minutes = Math.floor(this.minutes * 100) / 100;
    this.seconds = Math.floor(this.seconds * 100) / 100;
  }

  descontar() {
    this.seconds = this.seconds - 1;
  }

  toSeconds(): number {
    return this.minutes * 60 + this.seconds;
  }
};


export interface Tramo {
  value: number; // valor máximo del tramo
  color: string;
  msg: string;
};


export enum Simuladores {
  GALVANICA = "galvanica",
  MONOFASICA = "monofasica",
  BIFASICA = "bifasica",
  MEDIAFRECUENCIA = "mediafrecuencia",
  DIATERMIA = "diatermia", 
  ONDACORTA = "ondacorta", 
  MICROONDAS = "microondas", 
  INFRARROJOS = "infrarrojos", 
  LASER = "laser", 
  ULTRAVIOLETAS = "ultravioletas", 
  MAGNETOTERAPIA = "magnetoterapia", 
  ULTRASONIDOS = "ultrasonidos", 
  ONDASCHOQUE = "ondaschoque", 
};

export enum PositionsTDCS {
  C4 = "C4",
  C3 = "C3",
  F4 = "F4",
  F3 = "F3",
  FP1 = "FP1",
  FP2 = "FP2",

  // Disabled en Aprendizaje
  F7 = "F7",
  F8 = "F8",
  T3 = "T3",
  T4 = "T4",
  A1 = "A1",
  A2 = "A2",
  T5 = "T5",
  T6 = "T6",
  P3 = "P3",
  P4 = "P4",
  PZ = "PZ",
  CZ = "CZ",
  FZ = "FZ",
  O1 = "O1",
  O2 = "O2"
};

export const stringToPositionTDCS: Record<string, PositionsTDCS> = {
  ["C4"]: PositionsTDCS.C4,
  ["C3"]: PositionsTDCS.C3,
  ["F4"]: PositionsTDCS.F4,
  ["F3"]: PositionsTDCS.F3,
  ["FP1"]: PositionsTDCS.FP1,
  ["FP2"]: PositionsTDCS.FP2,
  ["F7"]: PositionsTDCS.F7,
  ["F8"]: PositionsTDCS.F8,
  ["T3"]: PositionsTDCS.T3,
  ["T4"]: PositionsTDCS.T4,
  ["A1"]: PositionsTDCS.A1,
  ["A2"]: PositionsTDCS.A2,
  ["T5"]: PositionsTDCS.T5,
  ["T6"]: PositionsTDCS.T6,
  ["P3"]: PositionsTDCS.P3,
  ["P4"]: PositionsTDCS.P4,
  ["PZ"]: PositionsTDCS.PZ,
  ["CZ"]: PositionsTDCS.CZ,
  ["FZ"]: PositionsTDCS.FZ,
  ["O1"]: PositionsTDCS.O1,
  ["O2"]: PositionsTDCS.O2 
}

export enum Roles {
  ALUMNO = "student",
  PROFESOR = "teacher"
};

export type Room = {
  _id: string;
  name: string;
  password: string;
  description: string;
  open: boolean;
  date: Date;
  logs: {logId: string, userId: string, userName: string, mark: number}[];
}

export type RoomStudent = {
  _id: string;
  name: string;
  description: string;
  open: boolean;
  date: Date;
  mark: number | null;
}

export type Log = {
  _id: string;
  userId: string;
  type: "evaluacion";
  sessionId: string;
  fixedParams: any;
  params: any[];
  finished: boolean;
  simulator: Simuladores;
  room: string;
}

export type List = {
  _id: string;
  teacher: string;
  asistentes: {userId: string, userName:string}[];
  isOpen: Boolean;
  start: Date;
}