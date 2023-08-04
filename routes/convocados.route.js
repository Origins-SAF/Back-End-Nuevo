import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
import validarJWT from "../middlewares/validar-jwt.js";
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import { getConvocados,
    getConvocadosArchivados, 
    postConvocados, 
    getAsistenciasPorPunto, 
    guardarAsistenciasPorPunto, 
    archivarPlanilla, 
    eliminarPlanillaLog, 
    actualizarPlanilla,
    getConvocadosArchivadosPorMes,
    crearJustificacionPlanilla
} from "../controllers/convocados.controller.js";
    
    
    router.get("/ver-convocados", getConvocados);
    router.get("/ver-convocados-archivados", getConvocadosArchivados);
    router.get("/ver-asistencia-puntos",validarJWT, getAsistenciasPorPunto);
    router.post("/guardar-convocados", postConvocados);
    router.put("/guardar-asistencia-puntos/:id", guardarAsistenciasPorPunto);
    router.put("/archivar-planilla/:id", archivarPlanilla);
    router.put("/actualizar-planilla/:id", actualizarPlanilla);
    router.put("/eliminar-planilla-log/:id", eliminarPlanillaLog);

    router.post("/crear-justificacion/:id/:idUser", crearJustificacionPlanilla);

    router.get("/ver-convocados-archivados-fecha", getConvocadosArchivadosPorMes)
  
    export default router;