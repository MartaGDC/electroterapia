import { config } from "dotenv";

config();

export const PORT = process.env.APP_PORT || 4000;
export const URI = process.env.DB_URI || '';
export const TOKEN = process.env.TOKEN_SECRET || 'token_secret';
