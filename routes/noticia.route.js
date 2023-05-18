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
   publicarNoticia,

   getNoticiasPublicas
    } from "../controllers/noticia.controller.js";
    

    import { upload } from "../Libs/upload.js";
    
    router.get("/ver-noticias", getNoticias);
    router.get("/ver-noticia-unica/:id", getNoticiarUnica);
    router.post("/guardar-noticia",upload.single("image"), postNoticia)
    router.put("/actualizar-noticia/:id",upload.single("image"), updateNoticia)
    router.put("/desactivar-log-noticia/:id", desactivarNoticia)
    router.put("/publicar-log-noticia/:id", publicarNoticia)
    router.delete("/eliminar-noticia/:id", eliminarNoticia)

    router.get("/ver-noticias-publicas", getNoticiasPublicas)
    export default router;