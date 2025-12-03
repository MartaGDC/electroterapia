import { Router } from "express";
import { create, eliminate, enterRoom, establishMark, getAllRoomLogs, getAllRooms, getAllRoomsStudent, getRoomById, update } from "../controllers/room.controller.js";
import { authRequired, authTeacherRequired } from "../libs/jwt.js";

const router = Router();

// Profesor
router.post('/create', authTeacherRequired, create);
router.post('/update', authTeacherRequired, update);
router.delete('/eliminate', authTeacherRequired, eliminate);
// router.post('/open', authTeacherRequired, open);
// router.post('/close', authTeacherRequired, close);
router.get('/getAllRooms', authTeacherRequired, getAllRooms);
router.get('/getAllRoomLogs', authTeacherRequired, getAllRoomLogs);
router.get('/getRoomById', authTeacherRequired, getRoomById);
router.post('/establishMark', authTeacherRequired, establishMark);

// Alumno
router.post('/enterRoom', authRequired, enterRoom)
router.get('/getAllRoomsStudent', authRequired, getAllRoomsStudent);

export default router;