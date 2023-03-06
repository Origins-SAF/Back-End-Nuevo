import { Router } from "express";
const router = Router();


// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
getInventarios,
obtenerInventarios,
postInventario  
} from "../controllers/inventario.controller.js";

import validarJWT  from "../middlewares/validar-jwt.js";

router.get("/ver-inventario", getInventarios);
router.post("/guardar-inventario",validarJWT, postInventario)

export default router;
