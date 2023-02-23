import { Router } from "express";
const router = Router();


// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
getInventarios,
postInventario  
} from "../controllers/inventario.controller.js";


router.get("/ver-inventario", getInventarios);
router.post("/guardar-inventario", postInventario)

export default router;
