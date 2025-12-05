import constants from "../constants/constants";
import axiosConfig from "./axiosConfig";

export const registerUser = async (props: any) => 
  await axiosConfig.post(constants.apiURL + "user/register", props);

export const loginUser = async (props: any) => 
  await axiosConfig.post(constants.apiURL + "user/login", props);

export const logoutUser = async () => 
  await axiosConfig.post(constants.apiURL + "user/logout");

export const changePasswordUser = async (props: any) => 
  await axiosConfig.post(constants.apiURL + "user/changePassword", props);

export const verifyTokenUser = async (props: any) => 
  await axiosConfig.put(constants.apiURL + "user/verifyToken", props);

export const getAllUsers = async () =>
  await axiosConfig.get(constants.apiURL + "user/getAllUsers");

export const createUsers = async (props: any) =>
  await axiosConfig.post(constants.apiURL + "user/createUsers", props);

export const deleteUsers = async (props: any) =>
  await axiosConfig.delete(constants.apiURL + "user/deleteUsers", {
    data: props
  });