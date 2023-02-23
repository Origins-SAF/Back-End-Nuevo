import{ Router } from ("express");
import { check } from ("express-validator");

import { validarJWT, validarCampos, esAdminRole } from ("../middlewares");

import {
  getPuntos,
  getPunto,
  PostPunto,
  PutPunto,
  DeletePunto,
} from ("../controllers/punto.controller.js");
const { existePuntoPorId } = require("../helpers/db-validators");

const router = Router();

//  Obtener todos los puntos - publico
router.get("/", getPuntos);

// Obtener un punto por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existePuntoPorId),
    validarCampos,
  ],
  getPunto
);

// Crear punto - privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  PostPunto
);

// Actualizar - privado - cualquiera con token válido
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existePuntoPorId),
    validarCampos,
  ],
  PutPunto
);

// Borrar un punto - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existePuntoPorId),
    validarCampos,
  ],
  DeletePunto
);

export default router;
