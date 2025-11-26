import express from "express";
import userRoutes from "./routes/user.routes.js"
import logRoutes from "./routes/log.routes.js"
import roomRoutes from "./routes/room.routes.js"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: `http://localhost:8100`, // Cambiar al puerto correcto si es diferente
  credentials: true, // Permite el envío de cookies y otras credenciales
}));

app.use("/api/user", userRoutes);
app.use("/api/log", logRoutes);
app.use("/api/room", roomRoutes);

export default app;