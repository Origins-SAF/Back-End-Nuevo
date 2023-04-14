import { Router } from "express";
const router = Router();


// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
getInventarios,
postInventario,
updateInventario,
deleteInventario,
deleteLogInventario,
reactivarLogInventario,
getInventarioUnico,
getInventariosDesactivados
} from "../controllers/inventario.controller.js";
import validarJWT from "../middlewares/validar-jwt.js";


router.get("/ver-inventario", getInventarios);
router.get("/ver-inventario-desactivados", getInventariosDesactivados);
router.get("/ver-inventario-unico/:id", getInventarioUnico);
router.post("/guardar-inventario",validarJWT, postInventario)
router.put("/actualizar-inventario/:id/:id_producto", updateInventario)
router.delete("/eliminar-inventario/:id", deleteInventario)

router.put("/eliminar-log-inventario/:id", deleteLogInventario)
router.put("/reactivar-log-inventario/:id", reactivarLogInventario)

export default router;
