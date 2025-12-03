import { Time } from "../constants/interfaces";

export const diatermia = {
  MODOS_DIATERMIA: {
    BIPOLAR: 0, MONOPOLAR: 1,
    values: [ 0, 1 ]  
  },
  TIPOS: {
    D_CET: 0, D_RET: 1, D_DIE: 2,
    values: [ 0, 1, 2 ]  
  },
  ELECTRODO_ACTIVO_BI: {
    E_S: 0, E_M: 1, E_XL: 2,
    values: [ 0, 1, 2 ]  
  },
  ELECTRODO_PASIVO_BI: {
    E_S: 0, E_XL: 1,
    values: [ 0, 1 ]  
  },
  ELECTRODO_ACTIVO_MO: {
    E_S: 0, E_XL: 1,
    values: [ 0, 1 ]  
  },
  CONDUCTORES: {
    BIPOLAR: 0, MONOPOLAR: 1,
    values: [ 0, 1, 2 ] // Es de 0 a 2 por → 0: D_CET, 1: D_RET, 2: D_DIE  
  },
  TRATAMIENTO: {
    min: new Time(0, 0), max: new Time(30, 0)
  },

  FRECUENCIA: {
    min: 0.3, max: 1.0, step: 0.1
  },
  FRECBI: {
    min: 0.3, max: 1, step: 0.1
  },
  FRECDIE: 0.48,
  POTENCIA: {
    min: 0, max: 500, step: 10
  },
  MODO_EMISION: {
    CONTINUO: 0, PULSADO: 1,
    values: [ 0, 1 ]  
  },
  DUTYCYCLES: [ 0, 1, 2, 3, 4, 9 ]
}

export const modos_diatermia = {
  BIPOLAR: 0, MONOPOLAR: 1,
  values: [ 0, 1 ]
}
export const tipos = {
  D_CET: 0, D_RET: 1, D_DIE: 2,
  values: [ 0, 1, 2 ]
};

export const electrodo_activo_bi = {
  E_S: 0, E_M: 1, E_XL: 2,
  values: [ 0, 1, 2 ]
};

export const electrodo_pasivo_bi = {
  E_S: 0, E_XL: 1,
  values: [ 0, 1 ]
};

export const electrodo_activo_mo = {
  E_S: 0, E_XL: 1,
  values: [ 0, 1 ]
}

export const conductores = {
  BIPOLAR: 0, MONOPOLAR: 1,
  values: [ 0, 1, 2 ] // Es de 0 a 2 por → 0: D_CET, 1: D_RET, 2: D_DIE
}

export const minTratamiento = new Time(0, 0);
export const maxTratamiento = new Time(30, 0);

export const minFrecBi = 0.3;
export const maxFrecBi = 1.0;
export const stepFrecBi = 0.1;

export const frecDie = 0.48;

export const minPotencia = 0;
export const maxPotencia = 500;
export const stepPotencia = 10;

export const modo_emision = {
  CONTINUO: 0, PULSADO: 1,
  values: [ 0, 1 ]
};

export const dutyCycles = [ 0, 1, 2, 3, 4, 9 ];