import  Router  from "express";


import {
  getPuntos,
  getPunto,
  postNuevoPunto
} from "../controllers/punto.controller.js";

const router = Router();

//  Obtener todos los puntos - publico
router.get("/", getPuntos);

// Obtener un punto por id - publico
router.get(
  "/:id",

  getPunto
);

// Crear punto - privado - cualquier persona con un token válido
router.post(
  "/nuevopunto",

  postNuevoPunto
);

/* // Actualizar - privado - cualquiera con token válido
router.put(
  "/:id",

  test2
);

// Borrar un punto - Admin
router.delete(
  "/:id",

  test3
); */

export default router;
