import { Router } from "express";
import { deleteLog, endLog, getLogById, initLog, saveParams } from "../controllers/log.controller.js";
import { authRequired, authTeacherRequired } from "../libs/jwt.js";

const router = Router();

// Alumno
router.post('/initLog', authRequired, initLog);
router.put('/saveParams', authRequired, saveParams);
router.put('/endLog', authRequired, endLog);
router.delete('/deleteLog', authRequired, deleteLog);

// Profesor
router.get('/getLogById', authTeacherRequired, getLogById);

export default router;