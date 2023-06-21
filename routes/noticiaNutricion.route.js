import { Router } from "express";
/* const { check } = require("express-validator"); */
const router = Router();
/* const { validarJWT, esAdminRole } = require("../middlewares"); */
// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
   getNoticiasNutricion,
   getNoticiasNutricionUnica,
   postNoticiasNutricion,
   updateNoticiasNutricion,
   eliminarNoticiasNutricion,

   desactivarNoticiasNutricion,
   publicarNoticiasNutricion,

   getNoticiasNutricionPublicas
    } from "../controllers/noticiaNutricion.controller.js";
    

    import { upload } from "../Libs/upload.js";
    
    router.get("/ver-nutriNoticias", getNoticiasNutricion);
    router.get("/ver-nutriNoticias-unica/:id", getNoticiasNutricionUnica);
    router.post("/guardar-nutriNoticias",upload.single("image"), postNoticiasNutricion)
    router.put("/actualizar-nutriNoticias/:id",upload.single("image"), updateNoticiasNutricion)
    router.put("/desactivar-log-nutriNoticias/:id", desactivarNoticiasNutricion)
    router.put("/publicar-log-nutriNoticias/:id", publicarNoticiasNutricion)
    router.delete("/eliminar-nutriNoticias/:id", eliminarNoticiasNutricion)

    router.get("/ver-noticiasNutricion-publicas", getNoticiasNutricionPublicas)
    export default router;