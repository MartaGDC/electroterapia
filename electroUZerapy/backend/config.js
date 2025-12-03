import { config } from "dotenv"; //dotenv permite cargan variables de entorno desde un archivo .env

config(); //carga las variables env permitiendo que con process.env queden disponibles desde Node

export const PORT = process.env.APP_PORT || 4000; //si existe variable de entorno app-port, se usa, si no se usa 4000
export const URI = process.env.DB_URI || ''; 
export const TOKEN = process.env.TOKEN_SECRET || 'token_secret';
