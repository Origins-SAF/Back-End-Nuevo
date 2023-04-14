import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)

import {
    getPartes,
    postParte,
    putParte,
    getPartesPorGrupos,
    getPartesPorFecha
  } from "../controllers/parte.controller.js";
import validarJWT from "../middlewares/validar-jwt.js";
  
  router.get("/ver-parte", getPartes);
  router.get("/ver-partes-dias-grupos", getPartesPorGrupos);
  router.get("/ver-partes-dias-fecha/:fechapd", getPartesPorFecha)
  router.post("/crear-parte",validarJWT, postParte);
  router.put("/editar-parte/:id",validarJWT, putParte);


export default router;