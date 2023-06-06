import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
import validarJWT from "../middlewares/validar-jwt.js";
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import { getConvocados, postConvocados, getAsistenciasPorPunto } from "../controllers/convocados.controller.js";
    
    
    router.get("/ver-convocados", getConvocados);
    router.get("/ver-asistencia-puntos",validarJWT, getAsistenciasPorPunto);
    router.post("/guardar-convocados", postConvocados);
  
    export default router;