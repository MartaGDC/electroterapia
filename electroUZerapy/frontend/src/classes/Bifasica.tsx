import { Time } from "../constants/interfaces";

export const bifasica = {
  TECNICAS: {
    B_NULL: 0, B_TENS_CONVENCIONAL: 1, B_TENS_ACUPUNTURA: 2, B_TENS_TRENES: 3, B_EENM: 4,
    values: [ 0, 1, 2, 3, 4 ]  
  },
  TIPOS_FIBRAS: {
    ABETA: 0, ADELTA: 1,
    values: [0, 1]  
  },
  ANCHURA: {
    min: 0, max: 650, step: 1
  },
  FRECUENCIA: {
    min: 0, max: 150, step: 1
  },
  FORMASONDA: {
    SIMETRICA: 0, ASIMETRICA: 1,
    values: [ 0, 1 ]  
  },
  INTENSIDAD: {
    min: 0, max: 100, step: 1
  },
  FRECUENCIATRENES: {
    min: 1, max: 10, step: 1
  }
}

export const tecnicas = {
  B_NULL: 0, B_TENS_CONVENCIONAL: 1, B_TENS_ACUPUNTURA: 2, B_TENS_TRENES: 3, B_EENM: 4,
  values: [ 0, 1, 2, 3, 4 ]
}

export const tipos_fibras = {
  ABETA: 0, ADELTA: 1,
  values: [0, 1]
}

export const minAnchura = 0;
export const maxAnchura = 650;
export const stepAnchura = 1;

export const minFrecuencia = 0;
export const maxFrecuencia = 150;
export const stepFrecuencia = 1;

export const formasOnda = {
  SIMETRICA: 0, ASIMETRICA: 1,
  values: [ 0, 1 ]
};

export const minIntensidad = 0;
export const maxIntensidad = 100;
export const stepIntensidad = 1;

export const minFrecuenciaTrenes = 1;
export const maxFrecuenciaTrenes = 10;
export const stepFrecuenciaTrenes = 1;

export const calculateMaxAnchuraTren = (frecuenciaTren: number) => {
  return Math.floor(1000 / frecuenciaTren);
}

export const plotSerie = (
  tratamiento: Time, 
  intensidad: number, 
  anchura: number, 
  formaOnda: any, 
  frecuencia: number,
  tecnica: number,
  anchuraTren: number,
  frecuenciaTren: number
) => {
  const res = [];
  const periodo = 1 / frecuencia;
  const segsTratamiento = Math.floor(tratamiento.toSeconds());
  const t_pos = anchura * 1e-6;

  if (tecnica != tecnicas.B_TENS_TRENES) {
    if (formaOnda == formasOnda.SIMETRICA) {
      // for (let seg = 0; seg < segsTratamiento; seg++) {
        for (let i = 0; i < frecuencia; i++) {
          const t_inicio = i * periodo; //+ seg;
          res.push({ x: t_inicio,             y: 0 });
          res.push({ x: t_inicio,             y: intensidad });
          res.push({ x: t_inicio + t_pos / 2, y: intensidad });
          res.push({ x: t_inicio + t_pos / 2, y: -intensidad });
          res.push({ x: t_inicio + t_pos,     y: -intensidad });
          res.push({ x: t_inicio + t_pos,     y: 0 });
        }
      // }
  
      res.push({x: segsTratamiento, y: 0})
      return [{ name: "Intensidad", data: res }];
  
    } else if (formaOnda == formasOnda.ASIMETRICA) {
      // for (let seg = 0; seg < segsTratamiento; seg++) {
        for (let i = 0; i < frecuencia; i++) {
          const t_inicio = i * periodo; //+ seg;
          res.push({ x: t_inicio,             y: 0 });
          res.push({ x: t_inicio,             y: intensidad });
          res.push({ x: t_inicio + t_pos / 2, y: intensidad });
          res.push({ x: t_inicio + t_pos / 2, y: - 3 * intensidad / 4 });
          res.push({ x: t_inicio + 3 * t_pos / 4, y: -intensidad * 0.5 });
          res.push({ x: t_inicio + 3 * t_pos / 2,     y: 0 });
        }
      // }
  
      res.push({x: segsTratamiento, y: 0})
      console.log(res)
      return [{ name: "Intensidad", data: res }];  
    } else {
      return [{ name: "Intensidad", data: [] }];
    }
  } else {
    if (formaOnda == formasOnda.SIMETRICA) {
      // for (let seg = 0; seg < segsTratamiento; seg++) {
      for (let ifrec = 0; ifrec < frecuenciaTren; ifrec++) {
        const t_ini_tren = ifrec / frecuenciaTren;
        const t_fin_tren = t_ini_tren + anchuraTren * 1e-3;

        let plot = true;
        let i = 0;
        while (plot) {
          const t_inicio = i * periodo + t_ini_tren; //+ seg;
          const t_mitad = t_inicio + t_pos / 2;
          const t_final = t_inicio + t_pos;

          if (t_fin_tren > t_inicio) {
            res.push({ x: t_inicio, y: 0 });
            res.push({ x: t_inicio, y: intensidad });  
          } else {
            plot = false;
          }

          if (t_fin_tren > t_mitad) {
            res.push({ x: t_mitad, y: intensidad });
            res.push({ x: t_mitad, y: -intensidad });
          } else {
            plot = false;
          }

          if (t_fin_tren > t_final) {
            res.push({ x: t_final, y: -intensidad });
            res.push({ x: t_final, y: 0 });  
          } else {
            plot = false;
          }

          i++;
        }
        res.push({ x: t_fin_tren, y: 0 });
      }
      // }
      
      res.push({x: segsTratamiento, y: 0})
      return [{ name: "Intensidad", data: res }];
  
    } else if (formaOnda == formasOnda.ASIMETRICA) {
      for (let ifrec = 0; ifrec < frecuenciaTren; ifrec++) {
        const t_ini_tren = ifrec / frecuenciaTren;
        const t_fin_tren = t_ini_tren + anchuraTren * 1e-3;

        let plot = true;
        let i = 0;
        while (plot) {
          const t_inicio = i * periodo + t_ini_tren; //+ seg;
          const t_mitad = t_inicio + t_pos / 2;
          const t_final = t_inicio + t_pos;

          if (t_fin_tren > t_inicio) {
            res.push({ x: t_inicio, y: 0 });
            res.push({ x: t_inicio, y: intensidad });
          } else {
            plot = false;
          }

          if (t_fin_tren > t_mitad) {
            res.push({ x: t_mitad, y: intensidad });
            res.push({ x: t_mitad, y: - 3 * intensidad / 4 });
          } else {
            plot = false;
          }

          if (t_fin_tren > t_final) {
            res.push({ x: t_final, y: -intensidad * 0.5 });
            res.push({ x: t_final, y: 0 });
          } else {
            plot = false;
          }
          res.push({ x: t_fin_tren, y: 0 });

          i++;
        }
      }
  
      res.push({x: segsTratamiento, y: 0})
      return [{ name: "Intensidad", data: res }];  
    } else {
      return [{ name: "Intensidad", data: [] }];
    }
  }
}