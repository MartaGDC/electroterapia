import { Router } from "express";
import { changePassword, createUsers, deleteUser, deleteUsers, getAllUsers, login, logout } from "../controllers/user.controller.js";
import { authRequired, authTeacherRequired, verifyToken } from "../libs/jwt.js";
const router = Router();

// Alumnos y Profesores
router.post('/login', login);
router.post('/logout', authRequired, logout);
// router.get('/getUserByID', authRequired, getUserByID);
// router.get('/getUserID', authRequired, getUserID);
router.post('/changePassword', authRequired, changePassword);
router.put('/verifyToken', authRequired, verifyToken);

// Profesores
router.get('/getAllUsers', authTeacherRequired, getAllUsers);
router.post('/createUsers', authTeacherRequired, createUsers);
router.delete('/deleteUser', authTeacherRequired, deleteUser);
router.delete('/deleteUsers', authTeacherRequired, deleteUsers);

export default router;