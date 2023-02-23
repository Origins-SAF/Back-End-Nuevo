import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
/* const { validarJWT, esAdminRole } = require("../middlewares"); */
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
    getDistribuidores,
    postDistribuidores  
    } from "../controllers/distribuidor.controller.js";
    
    
    router.get("/ver-distribuidor", getDistribuidores);
    router.post("/guardar-distribuidor", postDistribuidores)
    
    export default router;
    
