export const ondaschoque = {
  TIPO: {
    RADIAL: 0, FOCAL: 1,
    values: [ 0, 1 ]
  },
  APLICADOR: {
    RADIAL: { S: 10, M: 20, L: 35, values: [ 10, 20, 35 ] },
    FOCAL: { S: 5, M: 10, L: 15, values: [ 5, 10, 15 ] },
  },
  FRECUENCIA: [
    { min: 1, max: 16, step: 1 },
    { min: 1, max: 25, step: 1 },
  ],
  PRESION: [
    { min: 0, max: 5, step: 0.1 },
    { min: 0, max: 1.5, step: 0.1 },
  ],
  IMPACTOS: { min: 0, max: 10000, step: 1 },
  CONDUCCION: [ 0 ],
  DOSIS: { min: 0, max: 15000, step: 1}
};