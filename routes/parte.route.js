import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)

import {
    postParte,
    putParte
  } from "../controllers/parte.controller.js";

  router.get("/crear-parte", postParte);
  router.put("/editar-parte", putParte);


export default router;