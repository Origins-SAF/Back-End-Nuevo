import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
import validarJWT from "../middlewares/validar-jwt.js";
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import { getConvocados, postConvocados, getAsistenciasPorPunto, guardarAsistenciasPorPunto, archivarPlanilla, eliminarPlanillaLog } from "../controllers/convocados.controller.js";
    
    
    router.get("/ver-convocados", getConvocados);
    router.get("/ver-asistencia-puntos",validarJWT, getAsistenciasPorPunto);
    router.post("/guardar-convocados", postConvocados);
    router.put("/guardar-asistencia-puntos/:id", guardarAsistenciasPorPunto);
    router.put("/archivar-planilla/:id", archivarPlanilla);
    router.put("/eliminar-planilla-log/:id", eliminarPlanillaLog);
  
    export default router;