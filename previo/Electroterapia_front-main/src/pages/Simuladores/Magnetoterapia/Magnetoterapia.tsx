export const magnetoterapia = {
  TIPOS: {
    CONVENCIONAL: 0, SUPERINDUCTIVO: 1,
    values: [ 0, 1 ]  
  },
  APLICADORES: {
    PBMF: {
      SOLENOIDE: 0, PLACAS: 1,
      values: [ 0, 1 ]  
    },
    SIS: {
      PALA: 0,
      values: [ 0 ]
    }
  },
  INTENSIDADES: [
    { min: 0, max: 200, step: 1 },
    { min: 0, max: 3, step: 0.1 },  
  ],
  INTENSIDAD: {
    min: 0, max: 200, step: 1
  },
  FRECUENCIA: {
    min: 0, max: 150, step: 1
  },
  TIPO_FRECUENCIA: {
    FIJA: 0, BARRIDO: 1,
    values: [ 0, 1 ]  
  },
  MODOS_EMISION: {
    CONTINUO: 0, PULSADO: 1,
    values: [ 0, 1 ]  
  },
  DISTANCIA: {
    min: 0, max: 10, step: 1
  }
}

export const tipos = {
  CONVENCIONAL: 0, SUPERINDUCTIVO: 1,
  values: [ 0, 1 ]
};

export const aplicadores = {
  SOLENOIDE: 0, PLACAS: 1,
  values: [ 0, 1 ]
}

export const intensidades = [
  { min: 0, max: 200, step: 1 },
  { min: 0, max: 3, step: 0.1 },
]
export const minIntensidad = 0;
export const maxIntensidad = 200;
export const stepIntensidad = 1;

export const minFrecuencia = 0;
export const maxFrecuencia = 150;
export const stepFrecuencia = 1;

export const tipo_frecuencia = {
  FIJA: 0, BARRIDO: 1,
  values: [ 0, 1 ]
};

export const modos_emision = {
  CONTINUO: 0, PULSADO: 1,
  values: [ 0, 1 ]
};

export const minDistancia = 0;
export const maxDistancia = 10;
export const stepDistancia = 1;
