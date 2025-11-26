
export const tipos = {
  L_LLLT: 0, L_HILT: 1,
  values: [ 0, 1 ]
};

export const longitudesOnda = {
  LLLT_ROJO: { value: 0, min: 650, max: 680},
  LLLT_INFRARROJO: { value: 1, min: 780, max: 850},
  HILT: { value: 2, min: 905, max: 1064},
  values: [ 0, 1, 2 ]
};

export const superficie_tratada = {
  min: 1, max: 150, step: 1
}

export const dosis_total = {
  min: 0, max: 30, step: 1
}
export const modos_emision = {
  CONTINUO: 0, PULSADO: 1,
  values: [ 0, 1 ]
};

export const frecuenciasPulso = [
  { min: 0, max: 5000, step: 10 },   // LLLT (mW)
  { min: 0, max: 20000, step: 100 }, // HILT (W)
]

export const tipos_gafas = [
  { value: 0, name: `Gafas ${longitudesOnda.LLLT_ROJO.min}-${longitudesOnda.LLLT_ROJO.max}nm` },
  { value: 1, name: `Gafas ${longitudesOnda.LLLT_INFRARROJO.min}-${longitudesOnda.LLLT_INFRARROJO.max}nm` },
  { value: 2, name: `Gafas ${longitudesOnda.HILT.min}-${longitudesOnda.HILT.max}nm` }
]

export const aplicadores_LLLT = {
  PUNTUAL: 0, CLUSTER: 1,
  values: [ 0, 1 ]
}

export const aplicadores_HILT = {
  PUNTUAL: 0, CLUSTER: 1, ESCANER: 2,
  values: [ 0, 1, 2 ]
}

export const potencias = [
  [ // LLLT
    { min: 0, max: 500, step: 1},
    { min: 0, max: 3000, step: 1},
  ],
  [ // HILT
    { min: 0, max: 10, step: 1},
    { min: 0, max: 12, step: 1},
    { min: 0, max: 15, step: 1},
  ]
]

export const laser = {
  TIPOS: {
    L_LLLT: 0, L_HILT: 1,
    values: [ 0, 1 ]  
  },
  LONGITUDESONDA: {
    LLLT_ROJO: { value: 0, min: 650, max: 680},
    LLLT_INFRARROJO: { value: 1, min: 780, max: 850},
    HILT: { value: 2, min: 905, max: 1064},
    values: [ 0, 1, 2 ]  
  },
  SUPERFICIE_TRATADA: {
    min: 1, max: 150, step: 1
  },
  DOSIS_TOTAL: {
    min: 0, max: 30, step: 1
  },
  MODOS_EMISION: {
    CONTINUO: 0, PULSADO: 1,
    values: [ 0, 1 ]  
  },
  FRECUENCIASPULSO: [
    { min: 0, max: 5000, step: 10 },   // LLLT (mW)
    { min: 0, max: 20000, step: 100 }, // HILT (W)  
  ],
  TIPOS_GAFAS: [
    { value: 0, name: `Gafas ${longitudesOnda.LLLT_ROJO.min}-${longitudesOnda.LLLT_ROJO.max}nm` },
    { value: 1, name: `Gafas ${longitudesOnda.LLLT_INFRARROJO.min}-${longitudesOnda.LLLT_INFRARROJO.max}nm` },
    { value: 2, name: `Gafas ${longitudesOnda.HILT.min}-${longitudesOnda.HILT.max}nm` }  
  ],
  APLICADORES_LLLT: {
    PUNTUAL: 0, CLUSTER: 1,
    values: [ 0, 1 ]  
  },
  APLICADORES_HILT: {
    PUNTUAL: 0, CLUSTER: 1, ESCANER: 2,
    values: [ 0, 1, 2 ]  
  },
  POTENCIAS: [
    [ // LLLT
      { min: 0, max: 500, step: 1},
      { min: 0, max: 3000, step: 1},
    ],
    [ // HILT
      { min: 0, max: 10, step: 1},
      { min: 0, max: 12, step: 1},
      { min: 0, max: 15, step: 1},
    ]  
  ]
}
