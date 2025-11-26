export const mediafrecuencia = {
  MODOS_APLICACION: {
    M_BIPOLAR: 0, M_TETRAPOLAR: 1,
    values: [ 0, 1 ]  
  },
  TYPES_ELECTRODOS: {
    E_ADHESIVO: 0, E_CAUCHO_ESPONJA: 1,
    values: [ 0, 1 ]  
  },
  SIZES_ELECTRODOS: {
    E_S: 0, E_M: 1, E_L: 2, E_XL: 3, E_2XL: 4, E_3XL: 5,
    values: [ 0, 1, 2, 3, 4, 5]  
  },
  FRECUENCIAPORTADORA: {
    min: 2000, max: 10000, step: 500
  },
  FRECUENCIAMA: {
    min: 0, max: 100, step: 1
  },
  BARRIDO: {
    min: 0, max: 150, step: 1
  },
  INTENSIDAD: {
    min: 0, max: 100, step: 1
  },
  CONTORNOS: {
    NULL: 0, C_1_1: 1, C_6_6: 2, C_1_30_1_30: 3,
    C_1_5_1_5: 4, C_12_12: 5, PERSONALIZADO: 6,
    values: [ 0, 1, 2, 3, 4, 5, 6 ]  
  },
  CONTORNOS_PERSONALIZADO: {
    NULL: 0, TRIANGULAR: 1, TRAPEZOIDAL: 2, SINUSOIDAL: 3, CUADRADA: 4,
    EXPONENCIAL: 5, ALEATORIA: 6,
    values: [ 0, 1, 2, 3, 4, 5, 6 ]  
  },
  VECTORES: {
    V_ESTATICO: 0, V_LINEAL: 1, V_ROTATORIO: 2, V_ALEATORIO: 3,
    values: [ 0, 1, 2, 3 ]  
  }
}

export const modos_aplicacion = {
  M_BIPOLAR: 0, M_TETRAPOLAR: 1,
  values: [ 0, 1 ]
};

export const types_electrodos = {
  E_ADHESIVO: 0, E_CAUCHO_ESPONJA: 1,
  values: [ 0, 1 ]
};

export const sizes_electrodos = {
  E_S: 0, E_M: 1, E_L: 2, E_XL: 3, E_2XL: 4, E_3XL: 5,
  values: [ 0, 1, 2, 3, 4, 5]
};

export const minFrecuenciaPortadora = 2000;
export const maxFrecuenciaPortadora = 10000;
export const stepFrecuenciaPortadora = 500;

export const minFrecuenciaMA = 0;
export const maxFrecuenciaMA = 100;
export const stepFrecuenciaMA = 1;

export const minBarrido = 0;
export const maxBarrido = 150;
export const stepBarrido = 1;

export const minIntensidad = 0;
export const maxIntensidad = 100;
export const stepIntensidad = 1;

export const contornos = {
  NULL: 0, C_1_1: 1, C_6_6: 2, C_1_30_1_30: 3,
  C_1_5_1_5: 4, C_12_12: 5, PERSONALIZADO: 6,
  values: [ 0, 1, 2, 3, 4, 5, 6 ]
}

export const contornos_personalizado = {
  NULL: 0, TRIANGULAR: 1, TRAPEZOIDAL: 2, SINUSOIDAL: 3, CUADRADA: 4,
  EXPONENCIAL: 5, ALEATORIA: 6,
  values: [ 0, 1, 2, 3, 4, 5, 6 ]
};

export const vectores = {
  V_ESTATICO: 0, V_LINEAL: 1, V_ROTATORIO: 2, V_ALEATORIO: 3,
  values: [ 0, 1, 2, 3 ]
};

