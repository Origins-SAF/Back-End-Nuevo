import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
/* const { validarJWT, esAdminRole } = require("../middlewares"); */
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
    getProgramas,
    getStreamingsVivo,
    getProgramaUnico,
    postPrograma,
    updatePrograma,
    eliminarPrograma,
    getProgramasPublicados,

    desactivarPrograma,
    publicarPrograma
    } from "../controllers/programaVivo.controller.js";
    
    router.get("/ver-programa-vivo", getStreamingsVivo);
    router.get("/ver-programas", getProgramas);
    router.get("/ver-programas-publicados", getProgramasPublicados);
    router.get("/ver-programa-unico/:titulo", getProgramaUnico);
    router.post("/guardar-programa", postPrograma)
    router.put("/actualizar-programa/:id", updatePrograma)
    router.put("/desactivar-log-programa/:id", desactivarPrograma)
    router.put("/publicar-log-programa/:id", publicarPrograma)
    router.delete("/eliminar-programa/:id", eliminarPrograma)

    export default router;