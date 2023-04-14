import  Router  from "express";


import {
  getPuntos,
  getPunto,
  postNuevoPunto,
  updatePunto,
  eliminarPuntoLog,
  reactivarPuntoLog
} from "../controllers/punto.controller.js";
import validarJWT from "../middlewares/validar-jwt.js";

const router = Router();

//  Obtener todos los puntos - publico
router.get("/ver-puntos", getPuntos);

// Obtener un punto por id - publico
router.get("/ver-punto/:id",validarJWT,getPunto);

// Crear punto - privado - cualquier persona con un token válido
router.post("/guardar-punto",validarJWT,postNuevoPunto);

// Actualizar - privado - cualquiera con token válido
router.put("/actualizar-punto/:id",updatePunto);

// Borrar un punto - Log
router.put("/eliminar-punto-log/:id",eliminarPuntoLog);

// Reactivar un punto - Log
router.put("/reactivar-punto-log/:id",reactivarPuntoLog);

export default router;
