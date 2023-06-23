import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
/* const { validarJWT, esAdminRole } = require("../middlewares"); */
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
    getCronograma,
    postCronograma,
    putCronograma,
    putEstadoCronograma
    } from "../controllers/cronograma.controller.js";
    
    
    router.get("/ver-cronograma", getCronograma);
    router.post("/guardar-cronograma", postCronograma);
    router.put("/actualizar-cronograma/:id/:idCronogramaPunto", putCronograma)
    router.put("/actualizar-estado-cronograma/:id/:idCronogramaPunto", putEstadoCronograma)
  
    export default router;