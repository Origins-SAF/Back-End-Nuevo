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
deleteProductos,
publicacionProducto,

getProductosPublicados
} from "../controllers/producto.controller.js";

import { upload } from "../Libs/upload.js";

router.get("/ver-producto", getProductos);
router.get("/ver-producto/:id", getProducto);
router.put("/estado-producto/:id", publicacionProducto)
router.get("/ver-producto-distribuidor/:id/:numPage", getProductoDistribuidores);
router.get("/ver-producto-distribuidor/:id", getProductoDistribuidoresTodos);
router.post("/guardar-producto",upload.single("image"), postProducto)
router.put("/reactivar-producto-log/:id", reactivarProductoLog)

router.put("/actualizar-producto/:id",upload.single("image"), putProductos)
router.delete("/delete-producto/:id", deleteProductos)

router.get("/ver-productos-publicos", getProductosPublicados)

export default router;