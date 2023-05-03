import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
/* const { validarJWT, esAdminRole } = require("../middlewares"); */
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
   getNoticias,
   getNoticiarUnica,
   postNoticia,
   updateNoticia,
   eliminarNoticia,

   desactivarNoticia,
   publicarNoticia
    } from "../controllers/noticia.controller.js";
    
    
    router.get("/ver-noticias", getNoticias);
    router.get("/ver-noticia-unica/:id", getNoticiarUnica);
    router.post("/guardar-noticia", postNoticia)
    router.put("/actualizar-noticia/:id", updateNoticia)
    router.put("/desactivar-log-noticia/:id", desactivarNoticia)
    router.put("/publicar-log-noticia/:id", publicarNoticia)
    router.delete("/eliminar-noticia/:id", eliminarNoticia)
    export default router;