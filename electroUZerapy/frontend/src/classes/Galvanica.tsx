import { Electrodo } from "../classes/Electrodos";
import { Time } from "../constants/interfaces";

export const galvanica = {
  INTENSIDAD: {
    min: 0, max: 50, step: 0.1
  },
  TECNICAS: {
    NULL_TEC: 0, EPI_ALTA: 1, EPI_BAJA: 2, tDCS: 3,
    values: [ 0, 1, 2, 3 ]  
  }
}

export const minIntensidad = 0.0;
export const maxIntensidad = 50.0;

const maxIPerCm2 = 0.25;

// Devuelve la corriente galvánica máxima dependiendo del electrodo de menor
// tamaño
export const calcularMaximo = (catodo: Electrodo, anodo: Electrodo) => {
  const catodoArea = catodo.area();
  const anodoArea = anodo.area();

  return catodoArea < anodoArea ? catodoArea * maxIPerCm2 : anodoArea * maxIPerCm2;
}

// Devuelve un plot simple para su previsualización sin iniciar el tratamiento
export const plotSerie = (
  tratamiento: Time,
  rampa: Time, 
  intensidad: any, 
  catodo: any, 
  anodo: any
) => {
  const res = [];
  const max = [];

  const maxI = calcularMaximo(catodo, anodo);
  const tTrat = tratamiento.toSeconds();
  const tRamp = rampa.toSeconds();

  if (tRamp > 0) res.push({x: 0, y: 0});
  
  res.push({x: tRamp, y: intensidad});
  res.push({x: tTrat, y: intensidad});

  max.push({x: 0, y: maxI});
  max.push({x: tTrat, y: maxI});
  
  return [
    { name: "Intensidad", data: res },
    { name: "Máximo sin riesgo", data: max }
  ];
}

export const exhaustiveSerie = (tratamiento: any, rampa: any, intensidad: any, 
                                catodo: any, anodo: any) => {
  const res = [];
  const max = [];

  const maxI = calcularMaximo(catodo, anodo);
  const tTrat = tratamiento.toSeconds();
  const tRamp = rampa.toSeconds();

  // Hago el plot en dos bucles para evitar estar haciendo ifs y ganar eficiencia
  for (let i = 0; i < tRamp; i++) {
    res.push({x: i, y: i * intensidad / tRamp});
    max.push({x: i, y: maxI});
  }

  for (let i = tRamp; i <= tTrat; i++) {
    res.push({x: i, y: intensidad});
    max.push({x: i, y: maxI});
  }

  return [
    { name: "Intensidad", data: res },
    { name: "Máximo sin riesgo", data: max }
  ];
}

// Tipo enum de las técnicas especiales en corriente Galvánica
export const tecnicas = {
  NULL_TEC: 0, EPI_ALTA: 1, EPI_BAJA: 2, tDCS: 3,
  values: [ 0, 1, 2, 3 ]
};
