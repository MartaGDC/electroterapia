import constants from "../constants/constants";
import axiosConfig from "./axiosConfig";

export const createRoom = async (props: any) =>
  await axiosConfig.post(constants.apiURL + "room/create", props);

export const updateRoom = async (props: any) =>
  await axiosConfig.post(constants.apiURL + "room/update", props);

export const deleteRoom = async (props: any) =>
  await axiosConfig.delete(constants.apiURL + "room/eliminate", {
    data: props
  });

// export const openRoom = async (props: any) =>
//   await axiosConfig.post(constants.apiURL + "room/open", props);

// export const closeRoom = async (props: any) =>
//   await axiosConfig.post(constants.apiURL + "room/close", props);

export const getAllRooms = async () =>
  await axiosConfig.get(constants.apiURL + "room/getAllRooms");

export const getAllRoomsStudent = async () =>
  await axiosConfig.get(constants.apiURL + "room/getAllRoomsStudent");

export const getAllRoomLogs = async (roomId: string) =>
  await axiosConfig.get(constants.apiURL + "room/getAllRoomLogs", {
    params: { roomId }
  });

export const getRoomById = async (roomId: string) =>
  await axiosConfig.get(constants.apiURL + "room/getRoomById", {
    params: { roomId }
  });

export const establishMark = async (props: any) => 
  await axiosConfig.post(constants.apiURL + "room/establishMark", props)

  
export const enterRoom = async (props: any) =>
  await axiosConfig.post(constants.apiURL + "room/enterRoom", props);