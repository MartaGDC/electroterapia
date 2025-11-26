import { Clipboard } from '@capacitor/clipboard';

// Devuelve min si val < min, val si min <= val <= max y max si val > max
export const minMax = (val: any, min: any, max: any) => {
  return val < min ? min : ( val > max ? max : val )
};

export const valueOptions = (
  route: string, 
  t: any,
  valuesArray: (number | null)[],
  disabled: any
) => {
  const aux = t(route, { returnObjects: true });
  return Array.isArray(aux) 
    ? aux.map((el, idx) => (
        { name: el, value: valuesArray[idx], disabled: disabled(idx) }
      )) 
    : [];
}

export const tramosOptions = (
  route: string, 
  t: any,
) => {
  const auxTramosMsg = t(route, { returnObjects: true });
  return Array.isArray(auxTramosMsg) 
    ? auxTramosMsg.map((el, idx) => (el)) 
    : [];
}

export const msgArray = (
  route: string,
  t: any
) => {
  const auxTramosMsg = t(route, { returnObjects: true });
  return Array.isArray(auxTramosMsg) 
    ? auxTramosMsg.map((el, idx) => (el)) 
    : [];
}

export const copyToClipboard = async (text: string) => {
  try {
    await Clipboard.write({
      string: text,
    });
    console.log("Texto copiado");
    return true;
  } catch (err) {
    console.error("Error copiando al portapapeles", err);
    return false;
  }
};