export const infrarrojos = {
  EQUIPOS: {
    BOMBILLA: 0, REGULABLE: 1,
    values: [ 0, 1 ]   
  },
  POTENCIAS: [
    { min: 250, max: 250, step: 0},
    { min: 50, max: 500, step: 50},  
  ],
  OPCIONES_GAFAS: {
    NO_GAFAS: 0, SI_GAFAS: 1,
    values: [ 0, 1 ]
  },
  DISTANCIA: {
    min: 0, max: 200, step: 1
  }
}

export const equipos = {
  BOMBILLA: 0, REGULABLE: 1,
  values: [ 0, 1 ]
};

export const potencias = [
  { min: 250, max: 250, step: 0},
  { min: 50, max: 500, step: 50},
];

export const opciones_gafas = {
  NO_GAFAS: 0, SI_GAFAS: 1,
  values: [0, 1 ]
}

export const minDistancia = 0;
export const maxDistancia = 200;
export const stepDistancia = 1;

