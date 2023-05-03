import { Router } from "express";
const router = Router();


// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
getProductos,
getProducto,
postProducto,
getProductoDistribuidores,
reactivarProductoLog,
getProductoDistribuidoresTodos,
putProductos,
deleteProductos
} from "../controllers/producto.controller.js";


router.get("/ver-producto", getProductos);
router.get("/ver-producto/:id", getProducto);

router.get("/ver-producto-distribuidor/:id/:numPage", getProductoDistribuidores);
router.get("/ver-producto-distribuidor/:id", getProductoDistribuidoresTodos);
router.post("/guardar-producto", postProducto)
router.put("/reactivar-producto-log/:id", reactivarProductoLog)

router.put("/actualizar-producto/:id", putProductos)
router.delete("/delete-producto/:id", deleteProductos)

export default router;