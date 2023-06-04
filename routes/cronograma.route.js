import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
/* const { validarJWT, esAdminRole } = require("../middlewares"); */
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
    getCronograma,
    postCronograma,
    putCronograma
    } from "../controllers/cronograma.controller.js";
    
    
    router.get("/ver-cronograma", getCronograma);
    router.post("/guardar-cronograma", postCronograma);
    router.put("/actualizar-cronograma/:id", putCronograma)
    /*   router.get("/ver-distribuidor-unico/:id", getDistribuidorUnico);
    router.post("/guardar-distribuidor", postDistribuidores)
    router.put("/actualizar-distribuidor/:id", updateDistribuidores)
    router.put("/eliminar-log-distribuidor/:id", deleteLogDistribuidor)
    router.put("/reactivar-log-distribuidor/:id", reactivarLogDistribuidor)
    router.delete("/eliminar-distribuidor/:id", deleteDistribuidor) */
    export default router;