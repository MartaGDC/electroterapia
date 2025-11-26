export const ultrasonidos = {
  CABEZAL: [ 1, 2, 5, 10 ],
  CONDUCCION: [ 0 ],
  FRECUENCIA: [ 1, 3 ],
  INTENSIDAD: { min: 0, max: 3, step: 0.1 },
  MODO_EMISION: {
    CONTINUO: 0, PULSADO: 1,
    values: [ 0, 1 ]
  },
  RELACION_PULSO: [ 1, 0.5, 0.33, 0.25, 0.2, 0.166, 0.1 ],
  DOSIS_TOTAL: { min: 0, max: 30, step: 0.1},
  SUPERFICIE: { min: 0, max: 100, step: 1 },
  SUPERFICIE_CM: { min: 0, max: 100, step: 0.1 }
};