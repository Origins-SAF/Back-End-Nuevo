import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
/* const { validarJWT, esAdminRole } = require("../middlewares"); */
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
    getNotificacionesActivas,
    cambiarEstadoNotificacion
    } from "../controllers/notificacion.controller.js";
    import validarJWT from "../middlewares/validar-jwt.js";
    
    router.get("/ver-notificaciones", validarJWT, getNotificacionesActivas);
    router.put("/leer-notificacion/:id", cambiarEstadoNotificacion);

    export default router;
    