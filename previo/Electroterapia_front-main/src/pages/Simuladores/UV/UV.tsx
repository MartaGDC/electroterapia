export const ultravioletas = {
  TIPO_RADIACION: {
    UV_A: { value: 0,  min: 315,  max: 400, longitudOnda: 365 },
    UV_B: { value: 1, min: 280,  max: 315, longitudOnda: 311 },
    values: [ 0, 1 ]  
  },
  RADIACION: {
    min: 0, max: 5, step: 0.1
  },
  DISTANCIA: {
    min: 0, max: 20, step: 1
  },
  IRRADIANCIAS: [
    { minDist: 0, maxDist: 2, value: 5 },
    { minDist: 3, maxDist: 5, value: 3 },
    { minDist: 6, maxDist: 10, value: 2 },
    { minDist: 11, maxDist: 15, value: 1.5 },
    { minDist: 16, maxDist: 20, value: 1 },  
  ],
  IRRADIANCIACALC: {
    min: 1, max: 5, step: 0.5
  }
}

export const tipo_radiacion = {
  UV_A: { value: 0,  min: 315,  max: 400, longitudOnda: 365 },
  UV_B: { value: 1, min: 280,  max: 315, longitudOnda: 311 },
  values: [ 0, 1 ]
};

export const minRadiacion = 0;
export const maxRadiacion = 5;
export const stepRadiacion = 0.1;

export const minDistancia = 0;
export const maxDistancia = 20;
export const stepDistancia = 1;

export const irradiancias = [
  { minDist: 0, maxDist: 2, value: 5 },
  { minDist: 3, maxDist: 5, value: 3 },
  { minDist: 6, maxDist: 10, value: 2 },
  { minDist: 11, maxDist: 15, value: 1.5 },
  { minDist: 16, maxDist: 20, value: 1 },
]

export const irradianciaCalc = {
  min: 1, max: 5, step: 0.5
}