import constants from "../constants/constants";
import axiosConfig from "./axiosConfig";

export const initLog = async (props: any) => 
  await axiosConfig.post(constants.apiURL + "log/initLog", props);

export const saveParams = async (props: any) => 
  await axiosConfig.put(constants.apiURL + "log/saveParams", props);

export const endLog = async (props: any) => 
  await axiosConfig.put(constants.apiURL + "log/endLog", props);

export const deleteLog = async (props: any) => 
  await axiosConfig.delete(constants.apiURL + "log/deleteLog", {
    data: props
  });

export const getLogById = async (logId: string) => 
  await axiosConfig.get(constants.apiURL + "log/getLogById", {
    params: { logId }
  })