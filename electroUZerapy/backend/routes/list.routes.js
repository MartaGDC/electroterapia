import { Router } from "express";
import { createList, getAllLists, getListById, registrarAsistencia } from "../controllers/list.controller.js";
import { authRequired, authTeacherRequired } from "../libs/jwt.js";

const router = Router();

// Profesor
router.post("/createList", authTeacherRequired, createList);
router.get("/getAllLists", authTeacherRequired, getAllLists);
router.get("/getListById", authTeacherRequired, getListById);

//Alumno
router.post("/asistencia", authRequired, registrarAsistencia);

export default router;
