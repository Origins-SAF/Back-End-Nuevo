import { Router } from "express";
const router = Router();


// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
getProducto,
postProducto,
getProductoDistribuidores,
reactivarProductoLog,
getProductoDistribuidoresTodos
} from "../controllers/producto.controller.js";


router.get("/ver-producto", getProducto);
router.get("/ver-producto-distribuidor/:id/:numPage", getProductoDistribuidores);
router.get("/ver-producto-distribuidor/:id", getProductoDistribuidoresTodos);
router.post("/guardar-producto", postProducto)
router.put("/reactivar-producto-log/:id", reactivarProductoLog)

export default router;