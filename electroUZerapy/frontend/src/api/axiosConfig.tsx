import axios from "axios";
import constants from "../constants/constants";

const axiosConfig = axios.create({
  baseURL: constants.apiURL,
  withCredentials: true
})

export default axiosConfig;