import { Simuladores } from "../constants/interfaces";

////////////////////////////////////////////////////////////////////////////////
// Diatermia
////////////////////////////////////////////////////////////////////////////////
export class AplicadorDiatermia {
  name = Simuladores.DIATERMIA;
  type: "activo" | "pasivo";
  modoDiatermia: "bipolar" | "monopolar";
  size: 0 | 1 | 2 | null = null;

  constructor(
    type: "activo" | "pasivo", 
    modoDiatermia: "bipolar" | "monopolar",
    size: 0 | 1 | 2 | null = null
  ) {
    this.type = type;
    this.modoDiatermia = modoDiatermia;
    this.size = size;
  }

  toString(): string {
    return (
      "Diatermia > " + 
      (this.type === "activo" ? "Activo" : "Pasivo") +
      " > " +
      (this.modoDiatermia === "bipolar" ? "Bipolar" : "Monopolar") +
      " > " +
      (this.modoDiatermia === "bipolar" ? (
        this.type === "activo" ? (
          this.size === 0 ? "Pequeño (2.5 cm diámetro)"
          : this.size === 1 ? "Mediano (5 cm diámetro)"
          : this.size === 2 ? "Grande (10 cm diámetro)"
          : "Sin tamaño"
        ) : (
          this.size === 0 ? "Pequeño"
          : this.size === 1 ? "Grande"
          : "Sin tamaño"
        )
      ) : (
        this.size === 0 ? "Pequeño (2.5 cm diámetro)"
        : this.size === 1 ? "Grande (5 cm diámetro)"
        : "Sin tamaño"
      ))
    );
  }
  }

////////////////////////////////////////////////////////////////////////////////
// Onda Corta
////////////////////////////////////////////////////////////////////////////////
export class AplicadorOndaCorta {
  name = Simuladores.ONDACORTA;
  size: 0 | 1 | null = null;
  constructor(
    size: 0 | 1 | null = null
  ) {
    this.size = size;
  }

  toString(): string {
    return (
      "Onda Corta > " +
      (
        this.size == 0 ? "Placa metálica"
        : this.size == 1 ? "Bobina o tambor"
        : "Sin tamaño"
      )
    )
  }
}

////////////////////////////////////////////////////////////////////////////////
// Microondas
////////////////////////////////////////////////////////////////////////////////
export class AplicadorMicroondas {
  name = Simuladores.MICROONDAS;
  size: 0 | 1 | null = null;

  constructor(
    size: 0 | 1 | null = null
  ) {
    this.size = size;
  }

  toString(): string {
    return (
      "Microondas > " +
      (
        this.size == 0 ? "Radiación directa"
        : this.size == 1 ? "Campo conformado"
        : "Sin tamaño"
      )
    )
  }
}

////////////////////////////////////////////////////////////////////////////////
// Infrarrojos
////////////////////////////////////////////////////////////////////////////////
export class AplicadorInfrarrojos {
  name = Simuladores.INFRARROJOS;
  constructor() { }

  toString(): string { return "Infrarrojos" }
}

////////////////////////////////////////////////////////////////////////////////
// Láser
////////////////////////////////////////////////////////////////////////////////
export class AplicadorLaser {
  name = Simuladores.LASER;
  type: 0 | 1;
  size: 0 | 1 | 2 | null = null;

  constructor(
    type: 0 | 1,
    size: 0 | 1 | 2 | null = null
  ) {
    this.type = type;
    this.size = size;
  }

  toString(): string {
    return (
      "Láser > " +
      (
        this.type == 0 ? (
          "Láser de Baja Potencia (LLLT) > " +
          (
            this.size == 0 ? "Puntual (1 cm²)"
            : this.size == 1 ? "Cluster de 6 diodos (5 cm²)"
            : "Sin tamaño"
          )
        ) : (
          "Láser de Alta Potencia (HILT) > " +
          (
            this.size == 0 ? "Puntual (1 cm²)"
            : this.size == 1 ? "Cluster (5 cm²)"
            : this.size == 2 ? "Escáner"
            : "Sin tamaño"
          )
        )
      )
    )
  }
}

export class AplicadorUltravioletas {
  name = Simuladores.ULTRAVIOLETAS;

  constructor() { }

  toString(): string { return "Ultravioletas" }
}

export class AplicadorMagnetoterapia {
  name = Simuladores.MAGNETOTERAPIA;

  type: "convencional" | "superinductiva";
  size: 0 | 1 | null = null;

  constructor(
    type: "convencional" | "superinductiva",
    size: 0 | 1 | null = null
  ) {
    this.type = type;
    this.size = size;
  }

  toString(): string {
    return (
      "Magnetoterapia > " +
      (
        this.type == "convencional" ? (
          "Convencional > " +
          (
            this.size == 0 ? "Solenoide"
            : this.size == 1 ? "Placas electromagnéticas"
            : "Sin tamaño"
          )
        ) : (
          "Superinductiva > " +
          (
            this.size == 0 ? "Pala SIS"
            : "Sin tamaño"
          )
        )
      )
    )
  }
}

export class AplicadorUltrasonidos {
  name = Simuladores.ULTRASONIDOS;
  size: 1 | 2 | 5 | 10 | null = null;

  constructor(
    size: 1 | 2 | 5 | 10 | null = null
  ) {
    this.size = size;
  }

  toString(): string {
    return (
      "Ultrasonidos > " +
      (
        this.size == null ? "Sin tamaño"
        : this.size.toString() + " cm²"
      )
    )
  }
}

export class AplicadorOndasChoque {
  name = Simuladores.ONDASCHOQUE;
  type: "rswt" | "fswt";
  size: 0 | 1 | 2 | null = null;

  constructor(
    type: "rswt" | "fswt",
    size: 0 | 1 | 2 | null = null
  ) {
    this.type = type;
    this.size = size;
  }

  toString(): string {
    return (
      "Ondas de choque > " +
      (
        this.type == "rswt" ? (
          "Radial (RSWT) > " +
          (
            this.size == 0 ? "Pequeño (10 mm diámetro)"
            : this.size == 1 ? "Mediano (20 mm diámetro)"
            : this.size == 2 ? "Grande (35 mm diámetro)"
            : "Sin tamaño"
          )
        ) : (
          "Focal (FSWT) > " +
          (
            this.size == 0 ? "Pequeño (5 mm diámetro)"
            : this.size == 1 ? "Mediano (10 mm diámetro)"
            : this.size == 2 ? "Grande (15 mm diámetro)"
            : "Sin tamaño"
          )
        )
      )  
    )
  }
}
