import constants from "../constants/constants";
import axiosConfig from "./axiosConfig";

export const createNewList= async () =>
  await axiosConfig.post(constants.apiURL + "list/createList"); //PENDIENTE

export const getAllLists = async () =>
  await axiosConfig.get(constants.apiURL + "list/getAllLists");//PENDIENTE

export const getListByCode = async (codeQr: string) =>
  await axiosConfig.get(constants.apiURL + "list/getListByCode", { //PENDIENTE
    params: { codeQr }
  });

export const cambiarEstado= async (props: any)  =>
  await axiosConfig.post(constants.apiURL + "list/cambiarEstadoList", props);

export const registrarByCode = async (codeQr: string, userId: string) => 
  await axiosConfig.post(constants.apiURL + "list/asistencia", {codeQr, userId});