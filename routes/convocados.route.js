import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
/* const { validarJWT, esAdminRole } = require("../middlewares"); */
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import { getConvocados, postConvocados } from "../controllers/convocados.controller.js";
    
    
    router.get("/ver-convocados", getConvocados);
    router.post("/guardar-convocados", postConvocados);
  
    export default router;