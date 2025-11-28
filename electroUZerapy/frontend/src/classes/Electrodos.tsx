import { addCircleOutline, chevronUpCircleOutline, removeCircleOutline } from "ionicons/icons";
import { MaterialAdhesivo, MaterialAguja, MaterialCaucho } from "./Materiales";

export enum TipoElectrodo {
  CATODO = "-",
  ANODO = "+",
  OTRO = ""
};

const iconosElectrodo: Record<TipoElectrodo, any> = {
  [TipoElectrodo.ANODO]: addCircleOutline,
  [TipoElectrodo.CATODO]: removeCircleOutline,
  [TipoElectrodo.OTRO]: chevronUpCircleOutline
};

export class Electrodo {
  x: number;
  y: number;
  type: TipoElectrodo;
  name: string;
  color: string;
  material: MaterialAguja | MaterialCaucho | MaterialAdhesivo | null;
  canal: 1 | 2 | null;

  constructor(
    x: number = 50, y: number = 50, type: TipoElectrodo, color: string | null = null, 
    material: MaterialAguja | MaterialCaucho | MaterialAdhesivo | null = null,
    canal: 1 | 2 | null = null
  ) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.name = canal + type;

    if (color != null) this.color = color;
    else if (type == TipoElectrodo.ANODO) this.color = "#ff0000";
    else if (type == TipoElectrodo.CATODO) this.color = "#000000";
    else this.color = "";

    this.material = material;
    this.canal = canal;
  }

  getStringMaterial(): string | null {
    if (!this.material || this.canal == null) return null;
    return `${this.material.type} ${this.canal}`;
  }
  
  add(e: Electrodo): Electrodo {
    return new Electrodo(this.x + e.x, this.y + e.y, this.type, this.color);
  }

  icono() {
    return iconosElectrodo[this.type];
  }

  setMaterial(m: MaterialAguja | MaterialCaucho | MaterialAdhesivo | null) {
    this.material = m;
  }

  setToNull(): Electrodo {
    this.material = null;
    return this;
  }

  changeMaterialAndSize(
    material: MaterialAguja | MaterialCaucho | MaterialAdhesivo | null, 
  ): Electrodo {
    this.material = material;
    return this;
  }

  area(): number {
    return this.material == null ? 0 : this.material.area();
  }

  // Devuelve true si y solo si el electrodo tiene seleccionado un material y
  // un tamaño
  isPrepared(): boolean {
    return this.material != null && this.material.size != null;
  }
};
