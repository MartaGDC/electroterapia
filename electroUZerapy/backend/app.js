import express from "express"; // framework para crear api
import userRoutes from "./routes/user.routes.js"
import logRoutes from "./routes/log.routes.js"
import roomRoutes from "./routes/room.routes.js"
import cors from "cors"; //habilita peticiones desde el frontend
import cookieParser from "cookie-parser"; //para leer cookies en la API (necesario para JWT en cookies)

const app = express(); 
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: `http://localhost:5137`, // Estaba en el 8100 pero como uso Vite, el frontend usa este nuevo
  credentials: true, // Permite el envío de cookies y otras credenciales
}));

//registra las rutas:
app.use("/api/user", userRoutes); 
app.use("/api/log", logRoutes);
app.use("/api/room", roomRoutes);

export default app;