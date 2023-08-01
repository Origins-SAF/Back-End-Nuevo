import { Router } from "express";
const router = Router();


// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
    getInventariosProductor,
    getInventarioProductorUnico,
    getInventariosProductorDesactivados,

    postInventarioProductor,
    updateInventarioProductor,

    deleteInventarioProductor,
    deleteLogInventarioProductor,
    reactivarLogInventarioProductor
} from "../controllers/inventarioProductor.controller.js";
import validarJWT from "../middlewares/validar-jwt.js";


router.get("/ver-inventario-productores", getInventariosProductor);
router.get("/ver-inventario-desactivados", getInventariosProductorDesactivados);
router.get("/ver-inventario-unico/:id", getInventarioProductorUnico);
router.post("/guardar-inventario",validarJWT, postInventarioProductor)
router.put("/actualizar-inventario/:id/:id_producto", updateInventarioProductor)
router.delete("/eliminar-inventario/:id", deleteInventarioProductor)

router.put("/eliminar-log-inventario/:id", deleteLogInventarioProductor)
router.put("/reactivar-log-inventario/:id", reactivarLogInventarioProductor)

export default router;