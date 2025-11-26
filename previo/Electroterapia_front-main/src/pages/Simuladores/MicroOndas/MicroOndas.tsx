export const microondas = {
  APLICADORES: {
    RADIACION_DIRECTA: 0, CAMPO_CONFORMADO: 1,
    values: [ 0, 1 ]  
  },
  POTENCIA: {
    min: 0, max: 250, step: 10
  },
  MODO_EMISION: {
    CONTINUO: 0, PULSADO: 1,
    values: [ 0, 1 ]  
  },
  DUTYCYCLES: [ 0, 1, 2, 3, 4, 5, 9 ],
  DISTANCIA: {
    min: 0, max: 20, step: 1
  }
}

export const aplicadores = {
  RADIACION_DIRECTA: 0, CAMPO_CONFORMADO: 1,
  values: [ 0, 1 ]
}

export const minPotencia = 0;
export const maxPotencia = 250;
export const stepPotencia = 10;

export const modo_emision = {
  CONTINUO: 0, PULSADO: 1,
  values: [ 0, 1 ]
};

export const dutyCycles = [ 0, 1, 2, 3, 4, 5, 9 ];

export const minDistancia = 0;
export const maxDistancia = 20;
export const stepDistancia = 1;
