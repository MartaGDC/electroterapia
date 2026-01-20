import constants from "../constants/constants";
import axiosConfig from "./axiosConfig";

export const createNewTest= async (props: any) =>
  await axiosConfig.post(constants.apiURL + "test/createTest", props); //PENDIENTE

export const getAllTests = async () =>
  await axiosConfig.get(constants.apiURL + "test/getAllTests");//PENDIENTE

export const getAllTemas = async () =>
  await axiosConfig.get(constants.apiURL + "test/getAllTemas");//PENDIENTE

export const getTestById = async (testId: string) =>
  await axiosConfig.get(constants.apiURL + "test/getTestById", { //PENDIENTE
    params: { testId }
  });
export const getAllTestsCorregidos = async () =>
  await axiosConfig.get(constants.apiURL + "test/getAllTestsCorregidos");

export const getTestCorregidoById = async (testId: string) =>
  await axiosConfig.get(constants.apiURL + "test/getTestCorregidoById", {
    params: { testId }
  });

export const cambiarEstado= async (props: any)  =>
  await axiosConfig.post(constants.apiURL + "test/cambiarEstadoTest", props);

export const crearTestAleatorio = async (props: any) =>
  await axiosConfig.get(constants.apiURL + "test/crearTestAleatorio", props);

export const submit = async (testId: string) => 
  await axiosConfig.post(constants.apiURL + "test/submitTest", {
    params: {testId}
  });

