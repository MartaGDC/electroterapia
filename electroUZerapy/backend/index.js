import app from "./app.js" // importa app del archivo app.js donde está la instancia del servidor 
import { connectDB } from "./db.js"; // importa la función connectDB procedente de db.js
import { PORT, URI, TOKEN } from "./config.js" //importa puerto donde escucha el servidor, url de la base de datos MongoDB y el token como clave secreta usada para firmar JWT.

connectDB(URI); //con la funcion de conexion va a la url de la bd

app.listen(4000, '0.0.0.0');

console.log("Server on port", PORT);