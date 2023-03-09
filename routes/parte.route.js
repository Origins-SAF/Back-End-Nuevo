import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)

import {

    getPartes,
    postParte,
    putParte
  } from "../controllers/parte.controller.js";
import validarJWT from "../middlewares/validar-jwt.js";
  
  router.get("/ver-parte", getPartes);
  router.post("/crear-parte", postParte);
  router.put("/editar-parte/:id",validarJWT, putParte);


export default router;