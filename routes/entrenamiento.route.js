import { Router } from "express";
const router = Router();

// Requerimos los controladores (funciones que contendrán la lógica del endpoint)
import {
  getEntrenamiento,
  postEntrenamiento,
  putEntrenamiento
  } from "../controllers/entrenamiento.js";


  router.get("/ver-datos-entr", getEntrenamiento);
  router.post("/guardar-datos-entr", postEntrenamiento);
  router.put("/actualizar-datos-entr", putEntrenamiento);


export default router;