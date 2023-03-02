import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)

import {

    getPartes,
    postParte,
    putParte
  } from "../controllers/parte.controller.js";
  
  router.get("/ver-parte", getPartes);
  router.post("/crear-parte", postParte);
  router.put("/editar-parte", putParte);


export default router;