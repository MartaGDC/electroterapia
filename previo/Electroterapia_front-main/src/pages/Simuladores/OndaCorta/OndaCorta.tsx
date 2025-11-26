export const onda_corta = {
  MODOS: {
    CAPACITIVO: 0, INDUCTIVO: 1,
    values: [ 0, 1 ]  
  },
  ELECTRODOS: {
    METALICO: 0, BOBINA_TAMBOR: 1,
    values: [ 0, 1 ]  
  },
  FRECUENCIA: {
    min: 0, max: 100, step: 1, value: 27.12
  },
  POTENCIA: {
    min: 0, max: 500, step: 10
  },
  MODO_EMISION: {
    CONTINUO: 0, PULSADO: 1,
    values: [ 0, 1 ]  
  },
  DUTY_CYCLES: [
    0, 1, 2, 3, 4, 5, 9
  ],
  DISTANCIA: {
    min: 0, max: 20, step: 1
  }
}

export const modos = {
  CAPACITIVO: 0, INDUCTIVO: 1,
  values: [ 0, 1 ]
};

export const electrodos = {
  METALICO: 0, BOBINA_TAMBOR: 1,
  values: [ 0, 1 ]
}

export const minFrecuencia = 0;
export const maxFrecuencia = 100;
export const stepFrecuencia = 1;

export const minPotencia = 0;
export const maxPotencia = 500;
export const stepPotencia = 10;

export const modo_emision = {
  CONTINUO: 0, PULSADO: 1,
  values: [ 0, 1 ]
};

export const dutyCycles = [ 0, 1, 2, 3, 4, 5, 9 ];

export const minDistancia = 0;
export const maxDistancia = 20;
export const stepDistancia = 1;
