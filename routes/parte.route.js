import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)

import {
    postParte,
    putParte
  } from "../controllers/parte.controller.js";

  router.post("/crear-parte", postParte);
  router.put("/editar-parte/:id", putParte);


export default router;