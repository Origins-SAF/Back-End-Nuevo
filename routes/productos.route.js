import { Router } from "express";
const router = Router();


// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
getProducto,
postProducto 
} from "../controllers/producto.controller.js";


router.get("/ver-producto", getProducto);
router.post("/guardar-producto", postProducto)

export default router;