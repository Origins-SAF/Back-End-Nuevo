import { Router } from "express";
const router = Router();


// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
    getProductos,
    getProducto,
postProducto,
putProductos
} from "../controllers/producto.controller.js";


router.get("/ver-producto", getProductos);

router.get("/ver-producto/:id", getProducto);

router.post("/guardar-producto", postProducto)

router.put("/actualizar-producto/:id", putProductos)

export default router;