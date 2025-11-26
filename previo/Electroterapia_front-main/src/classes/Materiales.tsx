////////////////////////////////////////////////////////////////////////////////
// Aguja
////////////////////////////////////////////////////////////////////////////////
export enum SizeAguja {
  AGUJA_13 = 0,
  AGUJA_25 = 1,
  AGUJA_30 = 2,
  AGUJA_40 = 3,
  AGUJA_50 = 4,
  AGUJA_60 = 5,
  AGUJA_75 = 6,
  AGUJA_100 = 7,
};

export const valuesAgujaSizes: number[] = Array.from({length: 8}, (_, i) => i);

export class MaterialAguja {
  size: SizeAguja | null;
  type: "aguja";

  constructor(size: SizeAguja | null) {
    this.size = size;
    this.type = "aguja";
  }

  // Devuelve la cadena 
  toString(t: (key: string) => string): string {
    return t(`TAMAÑOS_AGUJA.${this.size}`);
  }

  area(): number {
    return 0;
  }
}

export const allAgujaSizes = [
  new MaterialAguja(SizeAguja.AGUJA_13),
  new MaterialAguja(SizeAguja.AGUJA_25),
  new MaterialAguja(SizeAguja.AGUJA_30),
  new MaterialAguja(SizeAguja.AGUJA_40),
  new MaterialAguja(SizeAguja.AGUJA_50),
  new MaterialAguja(SizeAguja.AGUJA_60),
  new MaterialAguja(SizeAguja.AGUJA_75),
  new MaterialAguja(SizeAguja.AGUJA_100),
];

////////////////////////////////////////////////////////////////////////////////
// Tamaños de caucho y adhesivo
////////////////////////////////////////////////////////////////////////////////
export enum SizeCauchoAdhesivo {
  PEQUENO = 0,      // Pequeño (2 x 2 cm)
  MEDIANO = 1,      // Mediano (5 x 5 cm)
  INTERMEDIO = 2,   // Intermedio (6 x 8 cm)
  GRANDE = 3,       // Grande (8 x 12 cm)
  MUYGRANDE = 4,    // Muy grande (12 x 18 cm)
  EXTRAGRANDE = 5,  // Extra grande (15 x 20 cm)
  CIRCULAR = 6      // Circular (35 cm²)
};

export const valuesCauchoAdhesivoSizes: number[] = Array.from({length: 7}, (_, i) => i);

const areaElectrodo: Record<SizeCauchoAdhesivo, number> = {
  [SizeCauchoAdhesivo.PEQUENO]: 4,
  [SizeCauchoAdhesivo.MEDIANO]: 25,
  [SizeCauchoAdhesivo.INTERMEDIO]: 48,
  [SizeCauchoAdhesivo.GRANDE]: 96,
  [SizeCauchoAdhesivo.MUYGRANDE]: 216,
  [SizeCauchoAdhesivo.EXTRAGRANDE]: 300,
  [SizeCauchoAdhesivo.CIRCULAR]: 35,
}

////////////////////////////////////////////////////////////////////////////////
// Caucho
////////////////////////////////////////////////////////////////////////////////
export class MaterialCaucho {
  size: SizeCauchoAdhesivo | null;
  type: "caucho";

  constructor(size: SizeCauchoAdhesivo | null) {
    this.size = size;
    this.type = "caucho";
  }

  // Devuelve la cadena 
  toString(t: (key: string) => string): string {
    return t(`TAMAÑOS_CAUCHO_ADHESIVO.${this.size}`);
  }

  area(): number {
    return this.size == null ? 0 : areaElectrodo[this.size];
  }
};

export const allCauchoSizes = [
  new MaterialCaucho(SizeCauchoAdhesivo.PEQUENO),
  new MaterialCaucho(SizeCauchoAdhesivo.MEDIANO),
  new MaterialCaucho(SizeCauchoAdhesivo.INTERMEDIO),
  new MaterialCaucho(SizeCauchoAdhesivo.GRANDE),
  new MaterialCaucho(SizeCauchoAdhesivo.MUYGRANDE),
  new MaterialCaucho(SizeCauchoAdhesivo.EXTRAGRANDE),
  new MaterialCaucho(SizeCauchoAdhesivo.CIRCULAR),
];

////////////////////////////////////////////////////////////////////////////////
// Adhesivo
////////////////////////////////////////////////////////////////////////////////
export class MaterialAdhesivo {
  size: SizeCauchoAdhesivo | null;
  type: "adhesivo";

  constructor(size: SizeCauchoAdhesivo | null) {
    this.size = size;
    this.type = "adhesivo";
  }

  // Devuelve la cadena 
  toString(t: (key: string) => string): string {
    return t(`TAMAÑOS_CAUCHO_ADHESIVO.${this.size}`);
  }

  area(): number {
    return this.size == null ? 0 : areaElectrodo[this.size];
  }
};

export const allAdhesivoSizes = [
  new MaterialAdhesivo(SizeCauchoAdhesivo.PEQUENO),
  new MaterialAdhesivo(SizeCauchoAdhesivo.MEDIANO),
  new MaterialAdhesivo(SizeCauchoAdhesivo.INTERMEDIO),
  new MaterialAdhesivo(SizeCauchoAdhesivo.GRANDE),
  new MaterialAdhesivo(SizeCauchoAdhesivo.MUYGRANDE),
  new MaterialAdhesivo(SizeCauchoAdhesivo.EXTRAGRANDE),
  new MaterialAdhesivo(SizeCauchoAdhesivo.CIRCULAR),
];

////////////////////////////////////////////////////////////////////////////////
// Complementos
////////////////////////////////////////////////////////////////////////////////
export enum Complemento {
  ESPONJA_HUMEDA = 0,
  GORRO_TDCS = 1,
  CINCHA = 2,
  CUBETA_AGUA = 3,
  GASAS = 4
};

export const allComplementos = [
  Complemento.ESPONJA_HUMEDA, Complemento.GORRO_TDCS, Complemento.CINCHA, 
  Complemento.CUBETA_AGUA, Complemento.GASAS,
]

////////////////////////////////////////////////////////////////////////////////
// Producto de conducción
////////////////////////////////////////////////////////////////////////////////
export enum ProductoConduccion {
  ACEITE = 0,
  GEL_ULTRASONIDOS = 1,
  CLORHEXIDINA = 2,
  GEL_SALINO = 3,
};

export const allProductosConduccion = [
  ProductoConduccion.ACEITE, ProductoConduccion.GEL_ULTRASONIDOS, 
  ProductoConduccion.CLORHEXIDINA, ProductoConduccion.GEL_SALINO
];

////////////////////////////////////////////////////////////////////////////////
// Producto de protección
////////////////////////////////////////////////////////////////////////////////
export enum ProductoProteccion {
  CLORHEXIDINA = 0,
  GAFAS = 1,
  GUANTES = 2,
}

export const allProductosProteccion = [
  ProductoProteccion.CLORHEXIDINA, ProductoProteccion.GAFAS, 
  ProductoProteccion.GUANTES, 
];

////////////////////////////////////////////////////////////////////////////////
// Fármacos
////////////////////////////////////////////////////////////////////////////////
export enum Farmacos {
  DEXAMETASONA = 0,
  ACIDO_ACETICO = 1,
  SALICILATO_SODICO = 2,
  IODURO_POTASIO = 3,
  CLORURO_CALCIO = 4,
  KETOPROFENO = 5,
  DICLOFENACO_SODICO = 6,
  LIDOCAINA = 7,
  HIDROCORTISONA = 8,
  ZINC_SULFATO = 9,
  HIALURONIDASA = 10,
  PILOCARPINA = 11,
  DICLOFENACO = 12,
  PIROXICAM = 13,
  IBUPROFENO = 14,
  INDOMETACINA = 15
};

export const allFarmacos = [
  Farmacos.DEXAMETASONA, Farmacos.ACIDO_ACETICO, Farmacos.SALICILATO_SODICO, 
  Farmacos.IODURO_POTASIO, Farmacos.CLORURO_CALCIO, Farmacos.KETOPROFENO, 
  Farmacos.DICLOFENACO_SODICO, Farmacos.LIDOCAINA, Farmacos.HIDROCORTISONA, 
  Farmacos.ZINC_SULFATO, Farmacos.HIALURONIDASA, Farmacos.PILOCARPINA, 
  Farmacos.DICLOFENACO, Farmacos.PIROXICAM, Farmacos.IBUPROFENO, 
  Farmacos.INDOMETACINA,
]