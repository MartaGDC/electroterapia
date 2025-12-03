import { Time } from "../constants/interfaces";

export const monofasica = {
  FORMASONDA: {
    F_CUADRANGULAR: 0, F_TRIANGULAR: 1, F_SINUSOIDAL: 2,
    values: [ 0, 1, 2 ]  
  },
  TECNICAS: {
    M_NULL: 0, M_TRABERT: 1, M_DIADINAMICAS: 2,
    values: [ 0, 1, 2 ]  
  },
  MINMAXANCHURAS: {
    TRABERT: { min: 1, max: 1000 },
    DIADINAMICA: { min: 10, max: 10 },
    FARADIZACION: { min: 0.1, max: 10 },
    EEM: { min: 10, max: 1000 }  
  },
  TIPOS_FIBRAS: {
    RELAJACION: 0, TIPO_I: 1, TIPO_IIa: 2, TIPO_IIb: 3,
    values: [ 0, 1, 2, 3 ]  
  },
  ANCHURAS: [
    { value: 0, name: "μs", min: 100, max: 1000, step: 1 },
    { value: 1, name: "ms", min: 1, max: 1000, step: 1 },  
  ],
  ANCHURAS_PAUSA: [
    { value: 0, name: "ms", min: 0, max: 1000, step: 1 },
    { value: 1, name: "s", min: 1, max: 6, step: 0.1 },  
  ],
  TIPOS_DIADINAMICA: {
    DIFASICA_FIJA: 0, MONOFASICA_FIJA: 1, CORTO_PERIODO: 2, LARGO_PERIODO: 3,
    values: [ 0, 1, 2, 3 ]  
  },
  TIEMPO_DIADINAMICA: new Time(0, 4),
  FRECUENCIA: {
    min: 1, max: 200, step: 1
  },
  INTENSIDAD: {
    min: 0, max: 100, step: 1
  },
  TIEMPOPAUSA: {
    min: 0, max: 0, step: 0
  }
}

export const formasOnda = {
  F_CUADRANGULAR: 0, F_TRIANGULAR: 1, F_SINUSOIDAL: 2,
  values: [ 0, 1, 2 ]
};

export const tecnicas = {
  M_NULL: 0, M_TRABERT: 1, M_DIADINAMICAS: 2,
  values: [ 0, 1, 2 ]
};

export const minMaxAnchuras = {
  TRABERT: { min: 1, max: 1000 },
  DIADINAMICA: { min: 10, max: 10 },
  FARADIZACION: { min: 0.1, max: 10 },
  EEM: { min: 10, max: 1000 }
}

export const tipos_fibras = {
  RELAJACION: 0, TIPO_I: 1, TIPO_IIa: 2, TIPO_IIb: 3,
  values: [ 0, 1, 2, 3 ]
}

export const anchuras = [
  { value: 0, name: "μs", min: 100, max: 1000, step: 1 },
  { value: 1, name: "ms", min: 1, max: 1000, step: 1 },
];

export const anchuras_pausa = [
  { value: 0, name: "ms", min: 0, max: 1000, step: 1 },
  { value: 1, name: "s", min: 1, max: 6, step: 0.1 },
];

export const tipos_diadinamica = {
  DIFASICA_FIJA: 0, MONOFASICA_FIJA: 1, CORTO_PERIODO: 2, LARGO_PERIODO: 3,
  values: [ 0, 1, 2, 3 ]
};

export const tiempo_diadinamica = new Time(0, 4);

// export const minAnchura = 100;
// export const maxAnchura = 6e6;
// export const stepAnchura = 0.1;

export const minFrecuencia = 1;
export const maxFrecuencia = 200;
export const stepFrecuencia = 1;

export const minIntensidad = 0;
export const maxIntensidad = 100;
export const stepIntensidad = 1;

export const minTiempoPausa = 0;
export const maxTiempoPausa = 0;
export const stepTiempoPausa = 0;

const ondaCuadrada = (
  t_inicio: number,
  t_pos: number,
  intensidad: number,
  segsTratamiento: number,
  res: {x: number, y: number}[]
) => {
  if (t_inicio + t_pos <= segsTratamiento) {
    res.push({ x: t_inicio,         y: 0 });
    res.push({ x: t_inicio,         y: intensidad });  
    res.push({ x: t_inicio + t_pos, y: intensidad });
    res.push({ x: t_inicio + t_pos, y: 0 });  
  }
}

const ondaTriangular = (
  t_inicio: number,
  t_pos: number,
  intensidad: number,
  segsTratamiento: number,
  res: {x: number, y: number}[]
) => {
  if (t_inicio + t_pos <= segsTratamiento) {
    res.push({ x: t_inicio,         y: 0 });
    res.push({ x: t_inicio + t_pos, y: intensidad });
    res.push({ x: t_inicio + t_pos, y: 0 });
  }
}

const ondaSinusoidal = (
  t_inicio: number,
  t_pos: number,
  intensidad: number,
  segsTratamiento: number,
  res: {x: number, y: number}[]
) => {
  if (t_inicio + t_pos <= segsTratamiento) {
    res.push({ x: t_inicio,         y: 0 });
    res.push({ x: t_inicio + t_pos / 2, y: intensidad });
    res.push({ x: t_inicio + t_pos, y: 0 });
  }
}

export const plotSerie = (
  tecnica: any,
  diadinamica: any,
  tratamiento: Time, 
  intensidad: number, 
  anchura: number,
  magnitudAnchura: number,
  formaOnda: any, 
  frecuencia: number
) => {
  const res: {x: number, y: number}[] = []; // Array de resultado
  const periodo = 1 / frecuencia; // Periodo (s)
  const segsTratamiento = Math.floor(tratamiento.toSeconds());
  const t_pos = anchura * (magnitudAnchura == anchuras[0].value ? 1e-6 : 1e-3);
  const ondaFunction: ((
    t_inicio: number,
    t_pos: number,
    intensidad: number,
    segsTratamiento: number,
    res: {x: number, y: number}[]
  ) => void)[] = [ondaCuadrada, ondaTriangular, ondaSinusoidal]

  const tecnicaFija = tecnica != tecnicas.M_DIADINAMICAS || 
    (tecnica == tecnicas.M_DIADINAMICAS && 
      (diadinamica == tipos_diadinamica.DIFASICA_FIJA || 
        diadinamica == tipos_diadinamica.MONOFASICA_FIJA))

  if (tecnicaFija) {

    let idx = formaOnda == formasOnda.F_CUADRANGULAR ? 0
            : formaOnda == formasOnda.F_TRIANGULAR ? 1
            : formaOnda == formasOnda.F_SINUSOIDAL ? 2
            : -1;

    if (idx != -1) {
      for (let seg = 0; seg < segsTratamiento; seg++) {
        for (let i = 0; i < frecuencia; i++) {
          ondaFunction[idx](i * periodo + seg, t_pos, intensidad, segsTratamiento, res)
        }  
      }  
    }
  
  } else if (tecnica == tecnicas.M_DIADINAMICAS && diadinamica == tipos_diadinamica.CORTO_PERIODO) {
    for (let seg = 0; seg < segsTratamiento; seg++) {
      frecuencia = seg % 2 == 0 ? 100 : 50;
      const per = 1 / frecuencia;
      for (let i = 0; i < frecuencia; i++) {
        ondaSinusoidal(i * per + seg, t_pos, intensidad, segsTratamiento, res)
      }
    }
    res.push({ x: segsTratamiento, y: 0 });

  } else if (tecnica == tecnicas.M_DIADINAMICAS && diadinamica == tipos_diadinamica.LARGO_PERIODO) {
    frecuencia = 50;
    let per = 1 / frecuencia;

    // 0-5: MF
    for (let seg = 0; seg < segsTratamiento / 2; seg++) {
      for (let i = 0; i < frecuencia; i++) {
        ondaSinusoidal(i * per + seg, t_pos, intensidad, segsTratamiento, res);
      }
    }

    // 5-7.5: subida de DF
    frecuencia = 100;
    per = 1 / frecuencia;
    let impulsosLP = (segsTratamiento / 4) * (frecuencia / 2);
    let intensidadInc = intensidad == 0 ? 0 : intensidad / impulsosLP;
    let intensidadLP = 0;
    for (let seg = segsTratamiento / 2; seg < (3 * segsTratamiento / 4); seg++) {
      for (let i = 0; i < frecuencia; i++) {
        if (i % 2 == 1) ondaSinusoidal(i * per + seg, t_pos, intensidad, (3 * segsTratamiento / 4), res);
        else {
          ondaSinusoidal(i * per + seg, t_pos, intensidadLP, (3 * segsTratamiento / 4), res);
          intensidadLP += intensidadInc;
        }
      }
    }

    // 7.5-10: bajada de DF
    intensidadLP = intensidad;
    for (let seg = (3 * segsTratamiento / 4); seg < segsTratamiento; seg++) {
      for (let i = 0; i < frecuencia; i++) {
        if (i % 2 == 1) ondaSinusoidal(i * per + seg, t_pos, intensidad, segsTratamiento, res);
        else {
          ondaSinusoidal(i * per + seg, t_pos, intensidadLP, segsTratamiento, res);
          intensidadLP -= intensidadInc;
        }
      }
    }
    res.push({ x: segsTratamiento, y: 0 });

    console.log(res)
  }

  res.push({ x: segsTratamiento, y: 0 });

  return [{ name: "Intensidad", data: res }];
}