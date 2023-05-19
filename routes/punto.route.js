import  Router  from "express";


import {
  getPuntos,
  getPunto,
  postNuevoPunto,
  updatePunto,
  eliminarPuntoLog,
  reactivarPuntoLog,
  publicacionPunto,

  getPuntosPublicos
} from "../controllers/punto.controller.js";
import validarJWT from "../middlewares/validar-jwt.js";
import { upload } from "../Libs/upload.js";

const router = Router();

//  Obtener todos los puntos - publico
router.get("/ver-puntos", getPuntos);

// Obtener un punto por id - publico
router.get("/ver-punto/:id",validarJWT,getPunto);

router.put("/publicacion-punto/:id",publicacionPunto);

// Crear punto - privado - cualquier persona con un token válido
router.post("/guardar-punto",validarJWT,upload.single("image"),postNuevoPunto);

// Actualizar - privado - cualquiera con token válido
router.put("/actualizar-punto/:id",validarJWT,upload.single("image"),updatePunto);

// Borrar un punto - Log
router.put("/eliminar-punto-log/:id",eliminarPuntoLog);

// Reactivar un punto - Log
router.put("/reactivar-punto-log/:id",reactivarPuntoLog);

router.get("/ver-puntos-publicos", getPuntosPublicos);

export default router;
